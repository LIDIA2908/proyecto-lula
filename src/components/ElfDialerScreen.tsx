import React, { useState } from "react";
import { Player } from "@remotion/player";
import { SonarRadarComposition } from "../remotion/SonarRadarComposition";
import { Icon } from "./Icon";

interface ElfDialerScreenProps {
  onStartCall: () => void;
}

export const ElfDialerScreen: React.FC<ElfDialerScreenProps> = ({ onStartCall }) => {
  const [isRinging, setIsRinging] = useState(false);

  const handleDialClick = () => {
    setIsRinging(true);

    // Play pleasant phone ringtone using Web Audio API
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

    // After 1.6 seconds of ringing, start call
    setTimeout(() => {
      onStartCall();
    }, 1600);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans text-white select-none overflow-y-auto flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn">
      {/* Ambient Background Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-2xl" />
      </div>

      {/* TOP HEADER */}
      <div className="relative z-10 text-center pt-4 sm:pt-6 flex flex-col items-center gap-1 animate-enter-down">
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
          <Icon name="clapperboard" className="w-4 h-4 text-emerald-400" />
          <span>Remotion 4.0 • Videollamada IA</span>
        </span>
      </div>

      {/* CENTER REMOTION SCANNER COMPOSITION */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto animate-enter-scale">
        <div className="w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center pointer-events-none">
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

        {/* CHARACTER DETAILS */}
        <div className="text-center mt-6 z-10 animate-enter-up">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide mb-1">
            Elfo Sabio
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-emerald-400 tracking-wider uppercase mb-3">
            Cultura General & Ciencia AI
          </p>

          {/* ONLINE STATUS BADGE */}
          <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-200 shadow-xl backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{isRinging ? "Llamando al Elfo..." : "En línea • Listo para responder"}</span>
          </div>
        </div>
      </div>

      {/* BOTTOM CALL BUTTON */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md pb-6 sm:pb-10 flex flex-col items-center gap-3 animate-enter-up">
        <button
          onClick={handleDialClick}
          disabled={isRinging}
          className={`w-full py-4 sm:py-5 rounded-full font-black text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-3 shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer duo-button-shadow ${
            isRinging
              ? "bg-amber-400 text-slate-950 animate-pulse"
              : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-105"
          }`}
        >
          <Icon
            name="phone"
            className="w-6 h-6 sm:w-7 sm:h-7"
            colorClass="bg-slate-950"
          />
          <span>{isRinging ? "Conectando..." : "Marcar al Elfo"}</span>
        </button>

        <p className="text-[11px] sm:text-xs text-slate-400 font-medium text-center">
          Haz clic para iniciar tu llamada de voz interactiva con Inteligencia Artificial
        </p>
      </div>
    </div>
  );
};
