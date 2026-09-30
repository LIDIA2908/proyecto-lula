import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "../components/Icon";

export const RemotionAIEngineComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header Title spring animation
  const titleScale = spring({ frame, fps, config: { damping: 12 } });

  // Node 1: User Input
  const node1Spring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12 } });

  // Node 2: Gemini AI Core Processing
  const node2Spring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12 } });

  // Node 3: Emotion Extractor
  const node3Spring = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 12 } });

  // Animated glow rotation for AI Core
  const rotateGlow = interpolate(frame, [0, 120], [0, 360]);

  return (
    <AbsoluteFill className="bg-transparent flex flex-col items-center justify-center p-3">
      {/* Title Badge */}
      <div
        className="flex items-center gap-2 bg-slate-900/95 border border-cyan-400/60 px-4 py-1.5 rounded-full shadow-2xl mb-3 backdrop-blur-md"
        style={{ transform: `scale(${titleScale})` }}
      >
        <Icon name="brain" className="w-4 h-4 text-cyan-400" />
        <span className="text-cyan-300 font-extrabold text-xs sm:text-sm tracking-wide">
          Flujo del Motor IA (Gemini 3.6 Flash)
        </span>
      </div>

      {/* 3-Step Pipeline Flow Nodes */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-md items-center">
        {/* Step 1: Input */}
        <div
          className="bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl text-center shadow-xl backdrop-blur-md flex flex-col items-center"
          style={{ transform: `scale(${node1Spring})` }}
        >
          <Icon name="speak" className="w-5 h-5 text-emerald-400 mb-1" />
          <h4 className="text-[11px] font-black text-white leading-tight">1. Pregunta</h4>
          <span className="text-[9px] font-medium text-slate-400 mt-0.5">Texto o Voz</span>
        </div>

        {/* Step 2: Gemini AI Engine */}
        <div
          className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-400 p-2.5 rounded-xl text-center shadow-2xl backdrop-blur-md relative flex flex-col items-center overflow-hidden"
          style={{ transform: `scale(${node2Spring})` }}
        >
          {/* Animated Glow Border */}
          <div
            className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl opacity-30 blur-sm pointer-events-none"
            style={{ transform: `rotate(${rotateGlow}deg)` }}
          />

          <Icon name="sparkles" className="w-5 h-5 text-cyan-400 mb-1 relative z-10" />
          <h4 className="text-[11px] font-black text-emerald-300 leading-tight relative z-10">
            2. Gemini AI
          </h4>
          <span className="text-[9px] font-bold text-cyan-300 mt-0.5 relative z-10">
            Razonamiento
          </span>
        </div>

        {/* Step 3: Animation & Speech Output */}
        <div
          className="bg-slate-900/90 border border-amber-500/40 p-2.5 rounded-xl text-center shadow-xl backdrop-blur-md flex flex-col items-center"
          style={{ transform: `scale(${node3Spring})` }}
        >
          <Icon name="sparkles" className="w-5 h-5 text-amber-400 mb-1" />
          <h4 className="text-[11px] font-black text-white leading-tight">3. Lottie + Voz</h4>
          <span className="text-[9px] font-semibold text-amber-400 mt-0.5">Postura & TTS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
