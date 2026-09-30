import React, { useState } from "react";
import { Player } from "@remotion/player";
import { SonarRadarComposition } from "../remotion/SonarRadarComposition";
import { Icon } from "./Icon";
import { ThemeToggleSwitch } from "./ThemeToggleSwitch";

interface LulaDialerScreenProps {
  onStartCall: () => void;
  onVisitStateMachine?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const LulaDialerScreen: React.FC<LulaDialerScreenProps> = ({
  onStartCall,
  onVisitStateMachine,
  isDarkMode = true,
  onToggleDarkMode,
}) => {
  const [isRinging, setIsRinging] = useState(false);

  const handleDialClick = () => {
    setIsRinging(true);

    try {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        const ctx = new AudioCtxClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(480, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.9);
      }
    } catch {
      // Ignore audio autoplay restrictions
    }

    setTimeout(() => {
      onStartCall();
    }, 1500);
  };

  return (
    <div
      className={`w-full h-full font-sans select-none overflow-y-auto flex flex-col items-center justify-between p-4 sm:p-5 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* TOP HEADER WITH TITLE & THEME TOGGLE BUTTON */}
      <div className="relative z-10 w-full pt-3 sm:pt-4 flex items-center justify-between animate-enter-down gap-2">
        <span
          className={`text-xs sm:text-sm font-black uppercase tracking-widest px-3.5 py-1.5 rounded-2xl border-2 border-b-4 flex items-center gap-2 ${
            isDarkMode
              ? "bg-slate-900 border-emerald-500 text-emerald-400"
              : "bg-emerald-50 border-emerald-500 text-emerald-800"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Lula • Videollamada IA</span>
        </span>

        {/* Custom Pill Theme Toggle Switch */}
        {onToggleDarkMode && (
          <ThemeToggleSwitch
            isDarkMode={isDarkMode}
            onToggle={onToggleDarkMode}
          />
        )}
      </div>

      {/* CENTER SONAR RADAR & AVATAR COMPOSITION */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-4 animate-enter-scale">
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Remotion Sonar Radar Loop */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-70">
            <Player
              acknowledgeRemotionLicense
              component={SonarRadarComposition}
              durationInFrames={120}
              compositionWidth={400}
              compositionHeight={400}
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

          {/* Central Avatar */}
          <div
            className={`relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-b-8 border-emerald-500 overflow-hidden flex items-center justify-center shadow-xl ${
              isDarkMode ? "bg-slate-900" : "bg-white"
            }`}
          >
            <img
              src={`${import.meta.env.BASE_URL}icons/elfo-llamada.png`}
              alt="Lula"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* CHARACTER DETAILS */}
        <div className="text-center mt-3 z-10 animate-enter-up">
          <h1 className="text-3xl sm:text-4xl font-black tracking-wide mb-0.5">
            Lula
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-emerald-500 tracking-wider uppercase mb-2">
            Asistente Virtual & IA
          </p>

          {/* ONLINE STATUS BADGE */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 border-b-4 text-xs font-black ${
              isDarkMode
                ? "bg-slate-900 border-slate-700 text-slate-200"
                : "bg-white border-slate-300 text-slate-800"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isRinging ? "bg-amber-400 animate-ping" : "bg-emerald-500 animate-pulse"
              }`}
            />
            <span>{isRinging ? "Conectando a Lula..." : "En línea • Lista para hablar"}</span>
          </div>
        </div>
      </div>

      {/* BOTTOM CALL & ACTION BUTTONS */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md pb-4 sm:pb-6 flex flex-col items-center gap-2.5 animate-enter-up">
        {/* Main Call Button (Duolingo 3D Flat Style) */}
        <button
          onClick={handleDialClick}
          disabled={isRinging}
          className={`w-full py-4 rounded-2xl font-black text-base tracking-wider uppercase flex items-center justify-center gap-3 border-2 border-b-6 transition-all duration-150 active:translate-y-1 active:border-b-2 cursor-pointer ${
            isRinging
              ? "bg-amber-400 border-amber-600 text-slate-950 animate-pulse"
              : "bg-emerald-500 hover:bg-emerald-400 border-emerald-700 text-slate-950"
          }`}
        >
          <Icon
            name="phone"
            className="w-6 h-6"
            colorClass="bg-slate-950"
          />
          <span>{isRinging ? "Llamando..." : "Llamar a Lula"}</span>
        </button>

        {/* State Machine Button */}
        {onVisitStateMachine && (
          <button
            onClick={onVisitStateMachine}
            className={`w-full py-3 rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 border-2 border-b-4 transition-all duration-150 active:translate-y-1 active:border-b-2 cursor-pointer ${
              isDarkMode
                ? "bg-purple-600 hover:bg-purple-500 border-purple-800 text-white"
                : "bg-purple-500 hover:bg-purple-400 border-purple-700 text-white"
            }`}
          >
            <Icon name="sparkles" className="w-4 h-4 text-white" />
            <span>Visitar Máquina de estados</span>
          </button>
        )}

        <p
          className={`text-xs font-semibold text-center px-4 ${
            isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Haz clic para iniciar tu llamada interactiva en tiempo real con Lula
        </p>
      </div>
    </div>
  );
};
