import React, { useEffect, useState } from "react";
import { CharacterState, LottieCharacter, STATE_SEGMENTS } from "./LottieCharacter";
import { Icon } from "./Icon";

interface StateMachineScreenProps {
  onReturnToCall: () => void;
  onReturnToDialer?: () => void;
  isDarkMode?: boolean;
}

interface StateOption {
  id: CharacterState;
  title: string;
  badge: string;
  frames: [number, number];
  description: string;
}

const STATE_OPTIONS: StateOption[] = [
  {
    id: "neutral",
    title: "Reposo / Neutral",
    badge: "NEUTRAL",
    frames: STATE_SEGMENTS.neutral,
    description: "Postura neutral en reposo",
  },
  {
    id: "hablando",
    title: "Hablar (A, E)",
    badge: "VOCAL A / E",
    frames: STATE_SEGMENTS.hablando,
    description: "Boca abierta para vocales A y E",
  },
  {
    id: "feliz",
    title: "A (Sonriente)",
    badge: "VOCAL A",
    frames: STATE_SEGMENTS.feliz,
    description: "Boca amplia sonriente para A",
  },
  {
    id: "triste",
    title: "Labial (B, M, P)",
    badge: "B / M / P",
    frames: STATE_SEGMENTS.triste,
    description: "Boca totalmente cerrada",
  },
  {
    id: "sorprendido",
    title: "O (Abierta)",
    badge: "VOCAL O",
    frames: STATE_SEGMENTS.sorprendido,
    description: "Boca redondeada abierta",
  },
  {
    id: "pensativo",
    title: "Dental (C, D, N)",
    badge: "C / D / N",
    frames: STATE_SEGMENTS.pensativo,
    description: "Posición para consonantes dentales",
  },
  {
    id: "vocal_u",
    title: "U (Fruncida)",
    badge: "VOCAL U",
    frames: STATE_SEGMENTS.vocal_u,
    description: "Boca fruncida circular",
  },
  {
    id: "vocal_ee",
    title: "I / F-V (Estirada)",
    badge: "VOCAL I",
    frames: STATE_SEGMENTS.vocal_ee,
    description: "Boca estirada horizontal para I y F/V",
  },
];

export const StateMachineScreen: React.FC<StateMachineScreenProps> = ({
  onReturnToCall,
  onReturnToDialer,
  isDarkMode = true,
}) => {
  const [currentState, setCurrentState] = useState<CharacterState>("neutral");
  const [isAutoCycle, setIsAutoCycle] = useState(false);

  // Auto-cycle through states every 2.2 seconds when enabled
  useEffect(() => {
    if (!isAutoCycle) return;
    const interval = setInterval(() => {
      setCurrentState((prev) => {
        const currentIndex = STATE_OPTIONS.findIndex((opt) => opt.id === prev);
        const nextIndex = (currentIndex + 1) % STATE_OPTIONS.length;
        return STATE_OPTIONS[nextIndex].id;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isAutoCycle]);

  const activeOption =
    STATE_OPTIONS.find((opt) => opt.id === currentState) || STATE_OPTIONS[0];

  return (
    <div
      className={`w-full h-full font-sans select-none overflow-y-auto flex flex-col justify-between p-3 relative transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* 1. TOP FLOATING ACTIVE STATE DETAILS BANNER */}
      <div className="relative z-20 pt-1 flex justify-center animate-enter-down flex-shrink-0">
        <div
          className={`px-4 py-1.5 rounded-2xl border-2 border-b-4 flex items-center gap-2.5 shadow-md ${
            isDarkMode
              ? "bg-slate-900 border-purple-500 text-white"
              : "bg-white border-purple-500 text-slate-900"
          }`}
        >
          <span className="px-2.5 py-0.5 rounded-xl bg-purple-500 text-white font-black text-xs uppercase tracking-wider">
            {activeOption.badge}
          </span>
          <span className="font-extrabold text-xs sm:text-sm">
            {activeOption.title}
          </span>
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded-xl border ${
              isDarkMode
                ? "bg-slate-950 border-purple-800 text-purple-300"
                : "bg-purple-50 border-purple-200 text-purple-800"
            }`}
          >
            f. {activeOption.frames[0]}-{activeOption.frames[1]}
          </span>
        </div>
      </div>

      {/* 2. FULL SCREEN HUGE WITCH CHARACTER (DEDICATED STAGE - HUGE TALL SCALE & 100% UNCOVERED) */}
      <div className="relative flex-1 w-full flex items-center justify-center py-6 my-auto min-h-[520px] z-10">
        <LottieCharacter state={currentState} size={520} />
      </div>

      {/* 3. CONTROL PANEL BELOW THE FULL-SIZED WITCH (ZERO OVERLAP WITH CHARACTER) */}
      <div
        className={`relative z-30 pt-2 flex flex-col gap-2 flex-shrink-0 border-t-2 rounded-t-3xl p-3 shadow-xl animate-enter-up mt-2 ${
          isDarkMode
            ? "bg-slate-950 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Auto-cycle toggle bar */}
        <div
          className={`flex items-center justify-between px-3.5 py-1.5 rounded-2xl border-2 border-b-4 ${
            isDarkMode
              ? "bg-slate-900 border-slate-800 text-slate-200"
              : "bg-slate-50 border-slate-300 text-slate-800"
          }`}
        >
          <span className="text-xs font-black flex items-center gap-2">
            <Icon name="radar" className="w-4 h-4 text-purple-500" />
            Secuencia Automática de Vocales:
          </span>
          <button
            onClick={() => setIsAutoCycle(!isAutoCycle)}
            className={`px-3 py-1 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-b-4 ${
              isAutoCycle
                ? "bg-purple-600 border-purple-800 text-white animate-pulse"
                : isDarkMode
                ? "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                : "bg-slate-200 border-slate-300 text-slate-600 hover:bg-slate-300"
            }`}
          >
            {isAutoCycle ? "ACTIVADO" : "DESACTIVADO"}
          </button>
        </div>

        {/* 2-Column Grid of 8 Flat Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {STATE_OPTIONS.map((option) => {
            const isActive = currentState === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setIsAutoCycle(false);
                  setCurrentState(option.id);
                }}
                className={`p-2.5 rounded-2xl border-2 border-b-4 flex items-center justify-between gap-1.5 transition-all duration-150 active:translate-y-0.5 active:border-b-2 cursor-pointer shadow-md ${
                  isActive
                    ? "bg-purple-600 border-purple-800 text-white shadow-purple-500/20"
                    : isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500"
                    : "bg-white border-slate-300 text-slate-800 hover:border-purple-500"
                }`}
              >
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <span
                    className={`px-1.5 py-0.2 rounded-lg text-[8px] font-black tracking-wider uppercase ${
                      isActive
                        ? "bg-slate-950 text-white"
                        : isDarkMode
                        ? "bg-purple-950 text-purple-300 border border-purple-800"
                        : "bg-purple-100 text-purple-900 border border-purple-200"
                    }`}
                  >
                    {option.badge}
                  </span>
                  <span className="font-extrabold text-[10px] text-left leading-tight truncate w-full mt-0.5">
                    {option.title}
                  </span>
                </div>
                <span className="text-[9px] opacity-80 font-mono flex-shrink-0">
                  f.{option.frames[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* TIRA "MÁQUINA DE ESTADOS" */}
        <div
          className={`flex items-center justify-between rounded-2xl p-2.5 border-2 border-b-4 ${
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-slate-50 border-slate-300"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-purple-500 border border-purple-400 flex items-center justify-center text-white font-bold flex-shrink-0">
              <Icon name="sparkles" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-black text-xs sm:text-sm leading-tight truncate">
                Máquina de Estados
              </h2>
              <p className="text-[10px] text-purple-500 font-bold truncate">
                Control de Vocales y Visemas
              </p>
            </div>
          </div>

          <button
            onClick={onReturnToCall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 border-2 border-b-4 border-emerald-700 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-transform active:translate-y-0.5 active:border-b-2 cursor-pointer flex-shrink-0"
          >
            <Icon name="phone" className="w-3.5 h-3.5 text-slate-950" />
            <span>Ir a la llamada</span>
          </button>
        </div>

        {/* VOLVER AL MARCADOR */}
        {onReturnToDialer && (
          <div className="flex justify-center pb-0.5">
            <button
              onClick={onReturnToDialer}
              className={`text-xs font-bold transition-colors py-0.5 cursor-pointer ${
                isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ← Volver al Marcador
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
