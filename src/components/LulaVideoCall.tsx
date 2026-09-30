import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { LottieCharacter } from "./LottieCharacter";
import { CallControls } from "./CallControls";
import { CelebrationXPComposition } from "../remotion/CelebrationXPComposition";
import { askAIAgent } from "../services/aiAgentService";
import { listenToUserSpeech, speakText, stopSpeaking } from "../services/voiceService";
import { Icon } from "./Icon";

interface LulaVideoCallProps {
  onReturnToDialer?: () => void;
  onVisitStateMachine?: () => void;
  isDarkMode?: boolean;
}

export const LulaVideoCall: React.FC<LulaVideoCallProps> = ({
  onReturnToDialer,
  onVisitStateMachine,
  isDarkMode = true,
}) => {
  const [noSpeak, setNoSpeak] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);

  // AI Agent States
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Real-time call duration timer
  const [callSeconds, setCallSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedMinutes = String(Math.floor(callSeconds / 60)).padStart(2, "0");
  const formattedSeconds = String(callSeconds % 60).padStart(2, "0");
  const callDurationStr = `${formattedMinutes}:${formattedSeconds}`;

  // Process user input question via AI Agent
  const handleAskQuestion = async (questionText: string) => {
    stopSpeaking();
    setIsThinking(true);
    setNoSpeak(true); // Callar while thinking

    try {
      const aiRes = await askAIAgent(questionText);
      setIsThinking(false);

      speakText(
        aiRes.replySpanish,
        () => {
          setNoSpeak(false); // hablar
        },
        () => {
          setNoSpeak(true); // callar
        }
      );
    } catch {
      setIsThinking(false);
      setNoSpeak(true);
    }
  };

  // Start voice listening with SpeechRecognition
  const handleStartListening = () => {
    if (isMuted) {
      setIsMuted(false);
    }
    stopSpeaking();
    setNoSpeak(true);
    setIsListening(true);

    const started = listenToUserSpeech(
      (transcript) => {
        setIsListening(false);
        handleAskQuestion(transcript);
      },
      (errMessage) => {
        setIsListening(false);
        console.warn("Speech recognition notice:", errMessage);
      }
    );

    if (!started) {
      setIsListening(false);
    }
  };

  return (
    <div
      className={`w-full h-full font-sans select-none overflow-y-auto flex flex-col justify-between p-2 sm:p-3 relative transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* TOP HEADER BAR */}
      <div
        className={`relative z-30 pt-2 px-2 sm:px-4 flex items-center justify-between pb-2 flex-shrink-0 animate-enter-down gap-2 border-b-2 ${
          isDarkMode
            ? "bg-slate-950 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Character Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center overflow-hidden shadow-md">
              <img
                src={`${import.meta.env.BASE_URL}icons/elfo-llamada.png`}
                alt="Lula"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-sm sm:text-base tracking-wide">
                Lula • Videollamada
              </h2>
              <Icon name="check" className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="flex items-center gap-2 text-xs font-extrabold mt-0.5">
              <span className="flex items-center gap-1.5 text-emerald-500 font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                EN VIVO
              </span>
              <span>•</span>
              <span className="font-mono text-xs sm:text-sm">{callDurationStr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN STAGE (Center Character) */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-2 z-10 min-h-0 overflow-hidden gap-2 animate-enter-scale">
        <LottieCharacter noSpeak={noSpeak} />
      </div>

      {/* CALL CONTROL BAR */}
      <div className="animate-enter-up relative z-30 pt-1 flex flex-col items-center gap-2">
        <CallControls
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          onEndCall={() => {
            stopSpeaking();
            setNoSpeak(true);
            setIsCallEnded(true);
          }}
          onSendTextQuestion={handleAskQuestion}
          onStartVoiceListening={handleStartListening}
          isListening={isListening}
          isThinking={isThinking}
          isDarkMode={isDarkMode}
        />

        {/* Visit State Machine Button */}
        {onVisitStateMachine && (
          <button
            onClick={() => {
              stopSpeaking();
              onVisitStateMachine();
            }}
            className={`w-full max-w-xs sm:max-w-sm py-2.5 rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 border-2 border-b-4 transition-all duration-150 active:translate-y-0.5 active:border-b-2 cursor-pointer shadow-md ${
              isDarkMode
                ? "bg-purple-600 hover:bg-purple-500 border-purple-800 text-white"
                : "bg-purple-500 hover:bg-purple-400 border-purple-700 text-white"
            }`}
          >
            <Icon name="sparkles" className="w-4 h-4 text-white" />
            <span>Visitar Máquina de Estados</span>
          </button>
        )}
      </div>

      {/* End Call Modal Overlay */}
      {isCallEnded && (
        <div
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center animate-fadeIn ${
            isDarkMode ? "bg-slate-950/95 text-white" : "bg-white/95 text-slate-900"
          }`}
        >
          {/* Remotion Animated XP Celebration Player */}
          <div className="w-72 h-44 sm:w-80 sm:h-52 mb-2 pointer-events-none flex items-center justify-center">
            <Player
              acknowledgeRemotionLicense
              component={CelebrationXPComposition}
              durationInFrames={90}
              compositionWidth={400}
              compositionHeight={300}
              fps={30}
              loop
              autoPlay
              controls={false}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
              }}
            />
          </div>

          <h3 className="text-3xl sm:text-4xl font-black mb-2">
            ¡Llamada Finalizada!
          </h3>
          <p className="text-sm sm:text-lg font-bold mb-6 max-w-md leading-relaxed">
            Hablaste con Lula durante <span className="font-extrabold text-emerald-500">{callDurationStr}</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                setIsCallEnded(false);
                setNoSpeak(true);
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 border-2 border-b-4 border-emerald-700 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg transition-transform active:translate-y-0.5 active:border-b-2 cursor-pointer"
            >
              Reiniciar Llamada
            </button>

            {onVisitStateMachine && (
              <button
                onClick={() => {
                  setIsCallEnded(false);
                  onVisitStateMachine();
                }}
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 border-2 border-b-4 border-purple-800 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg transition-transform active:translate-y-0.5 active:border-b-2 cursor-pointer"
              >
                Máquina de Estados
              </button>
            )}

            {onReturnToDialer && (
              <button
                onClick={() => {
                  setIsCallEnded(false);
                  setNoSpeak(true);
                  onReturnToDialer();
                }}
                className={`px-6 py-3 rounded-2xl border-2 border-b-4 font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg transition-transform active:translate-y-0.5 active:border-b-2 cursor-pointer ${
                  isDarkMode
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                    : "bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-800"
                }`}
              >
                Volver a Marcar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
