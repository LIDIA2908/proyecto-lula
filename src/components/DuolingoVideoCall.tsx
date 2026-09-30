import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { CharacterState, LottieCharacter } from "./LottieCharacter";
import { SpeechBubble } from "./SpeechBubble";
import { CallControls } from "./CallControls";
import { CelebrationXPComposition } from "../remotion/CelebrationXPComposition";
import { askAIAgent } from "../services/aiAgentService";
import { listenToUserSpeech, speakText, stopSpeaking } from "../services/voiceService";
import { Icon } from "./Icon";

interface DuolingoVideoCallProps {
  onReturnToDialer?: () => void;
}

export const DuolingoVideoCall: React.FC<DuolingoVideoCallProps> = ({ onReturnToDialer }) => {
  const [currentState, setCurrentState] = useState<CharacterState>("neutral");
  const [isMuted, setIsMuted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);

  // AI Agent States
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState<string>("");
  const [customDialogue, setCustomDialogue] = useState<{ es: string; en: string } | null>(null);

  // Real-time call duration timer for web app
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


  // Default dialogue map per state (General Knowledge Trivia)
  const defaultDialogueMap: Partial<Record<CharacterState, { es: string; en: string }>> = {
    neutral: {
      es: "¡Hola! Soy el Elfo Sabio de Cultura General. Pregúntame lo que quieras sobre ciencia, historia, geografía o arte.",
      en: "Hello! I'm the General Knowledge Wise Elf. Ask me anything about science, history, geography or art.",
    },
    feliz: {
      es: "¡Esa es una curiosidad fascinante del universo! ¡Has ganado +20 XP por aprender algo nuevo hoy!",
      en: "That's a fascinating trivia fact about the universe! You earned +20 XP for learning something new today!",
    },
    triste: {
      es: "Ese fue un evento triste en la historia... Pero recordar nuestro pasado nos hace más sabios.",
      en: "That was a sad event in history... But remembering our past makes us wiser.",
    },
    hablando: {
      es: "¡Sabías que la luz del Sol tarda exactamente 8 minutos y 20 segundos en llegar a la Tierra!",
      en: "Did you know sunlight takes exactly 8 minutes and 20 seconds to reach Earth!",
    },
  };

  const currentDialogue = customDialogue || defaultDialogueMap[currentState] || defaultDialogueMap.neutral!;

  // Shuffle state manager for 1 pose per question
  const ALL_STATES: CharacterState[] = ["feliz", "hablando", "triste", "neutral"];
  const lastStateRef = React.useRef<CharacterState>("neutral");

  const getNextShuffledState = (preferred?: CharacterState): CharacterState => {
    if (preferred && preferred !== "hablando" && preferred !== lastStateRef.current) {
      lastStateRef.current = preferred;
      return preferred;
    }
    const candidates = ALL_STATES.filter((s) => s !== lastStateRef.current);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    lastStateRef.current = chosen;
    return chosen;
  };

  // Timer ref for holding response emotion pose
  const emotionTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Process user input question via AI Agent
  const handleAskQuestion = async (questionText: string) => {
    if (emotionTimerRef.current) {
      clearTimeout(emotionTimerRef.current);
    }
    stopSpeaking();
    setUserTranscript(questionText);
    setCustomDialogue(null);
    setIsThinking(true);
    // While thinking, character remains in current neutral state without changing

    try {
      const aiRes = await askAIAgent(questionText);

      // Determine the shuffled response pose for this answer
      const targetState = getNextShuffledState(aiRes.emotion);

      setCustomDialogue({
        es: aiRes.replySpanish,
        en: aiRes.replyEnglish,
      });
      setIsThinking(false);

      // Immediately set the character pose for this answer when audio starts
      speakText(
        aiRes.replySpanish,
        () => {
          setCurrentState(targetState);
        },
        () => {
          // Return to default neutral posture when audio finishes speaking!
          setCurrentState("neutral");
        }
      );
    } catch (err) {
      setIsThinking(false);
      setCustomDialogue({
        es: "Hubo un error al procesar tu pregunta. ¡Inténtalo de nuevo!",
        en: "There was an error processing your question. Try again!",
      });
      setCurrentState("triste");
    }
  };

  // Start voice listening with SpeechRecognition
  const handleStartListening = () => {
    if (isMuted) {
      setIsMuted(false);
    }
    stopSpeaking();
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
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 font-sans text-white select-none overflow-y-auto flex flex-col justify-between p-2 sm:p-4">

      {/* Dynamic Background Ambient Lighting */}
      <div
        className={`absolute inset-0 opacity-25 pointer-events-none transition-colors duration-700 ${
          currentState === "feliz"
            ? "bg-amber-500"
            : currentState === "triste"
            ? "bg-indigo-600"
            : currentState === "hablando"
            ? "bg-emerald-500"
            : "bg-teal-600"
        }`}
      />

      {/* TOP HEADER BAR */}
      <div className="relative z-30 pt-1 sm:pt-2 px-2 sm:px-4 flex items-center justify-between bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-transparent pb-2 flex-shrink-0 animate-enter-down">
        {/* Character Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center overflow-hidden shadow-xl">
              <img
                src={`${import.meta.env.BASE_URL}icons/elfo-llamada.png`}
                alt="Elfo Sabio"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-2">
              <h2 className="font-black text-xs sm:text-base md:text-xl tracking-wide text-white">
                Elfo Sabio • Cultura General AI
              </h2>
              <Icon name="check" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-300 mt-0.5">
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] sm:text-xs">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
                EN VIVO
              </span>
              <span>•</span>
              <span className="font-mono text-xs sm:text-sm">{callDurationStr}</span>
            </div>
          </div>
        </div>

      </div>

      {/* MAIN STAGE (Center Character & Speech) */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-1 z-10 min-h-0 overflow-hidden gap-1 sm:gap-2 animate-enter-scale">
        {/* Lottie Character Component */}
        <LottieCharacter state={currentState} />

        {/* Interactive Speech Bubble */}
        <div className="w-full animate-enter-up">
          <SpeechBubble
            spanishText={currentDialogue.es}
            englishText={currentDialogue.en}
            isSpeaking={currentState === "hablando"}
            isThinking={isThinking}
            userTranscript={userTranscript}
          />
        </div>
      </div>


      {/* CALL CONTROL BAR */}
      <div className="animate-enter-up">
        <CallControls
        currentState={currentState}
        onStateChange={(newState) => {
          setCustomDialogue(null);
          setCurrentState(newState);
        }}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        onEndCall={() => {
          stopSpeaking();
          setIsCallEnded(true);
        }}
        onSendTextQuestion={handleAskQuestion}
        onStartVoiceListening={handleStartListening}
        isListening={isListening}
        isThinking={isThinking}
      />
      </div>

      {/* End Call Modal Overlay */}
      {isCallEnded && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
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

          <h3 className="text-3xl sm:text-4xl font-black text-white mb-2">
            ¡Llamada Finalizada!
          </h3>
          <p className="text-sm sm:text-lg font-medium text-slate-300 mb-6 max-w-md leading-relaxed">
            Practicaste durante <span className="font-bold text-emerald-400">{callDurationStr}</span>. ¡Ganaste +30 XP por tu práctica diaria!
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                setIsCallEnded(false);
                setUserTranscript("");
                setCustomDialogue(null);
                setCurrentState("neutral");
              }}
              className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base tracking-wider uppercase shadow-2xl transition-transform active:scale-95 cursor-pointer duo-button-shadow"
            >
              Reiniciar Llamada
            </button>
            {onReturnToDialer && (
              <button
                onClick={() => {
                  setIsCallEnded(false);
                  onReturnToDialer();
                }}
                className="px-8 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-base tracking-wider uppercase shadow-xl transition-transform active:scale-95 cursor-pointer"
              >
                Marcar de Nuevo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
