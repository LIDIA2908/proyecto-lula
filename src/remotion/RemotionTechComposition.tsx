import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "../components/Icon";

export const RemotionTechComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance for title
  const titleScale = spring({ frame, fps, config: { damping: 12 } });

  // Staggered card spring entrances
  const card1 = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12 } });
  const card2 = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12 } });
  const card3 = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12 } });

  return (
    <AbsoluteFill className="bg-transparent flex flex-col items-center justify-center p-3">
      {/* Film Reel Icon + Title Badge */}
      <div
        className="flex items-center gap-2 bg-emerald-950/90 border border-emerald-400/60 px-4 py-1.5 rounded-full shadow-xl mb-3"
        style={{ transform: `scale(${titleScale})` }}
      >
        <Icon name="clapperboard" className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-300 font-extrabold text-xs sm:text-sm tracking-wide">
          Remotion 4.0 Video Framework
        </span>
      </div>

      {/* Remotion Compositions Timeline Grid */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
        <div
          className="bg-slate-900/90 border border-emerald-500/40 p-2.5 rounded-xl text-center shadow-lg backdrop-blur-md flex flex-col items-center"
          style={{ transform: `scale(${card1})` }}
        >
          <Icon name="radar" className="w-5 h-5 text-emerald-400 mb-1" />
          <h4 className="text-[11px] font-black text-white">Sonar Radar</h4>
          <span className="text-[9px] font-semibold text-emerald-400">120 frames</span>
        </div>

        <div
          className="bg-slate-900/90 border border-cyan-500/40 p-2.5 rounded-xl text-center shadow-lg backdrop-blur-md flex flex-col items-center"
          style={{ transform: `scale(${card2})` }}
        >
          <Icon name="sparkles" className="w-5 h-5 text-cyan-400 mb-1" />
          <h4 className="text-[11px] font-black text-white">Hero Banner</h4>
          <span className="text-[9px] font-semibold text-cyan-400">120 frames</span>
        </div>

        <div
          className="bg-slate-900/90 border border-amber-500/40 p-2.5 rounded-xl text-center shadow-lg backdrop-blur-md flex flex-col items-center"
          style={{ transform: `scale(${card3})` }}
        >
          <Icon name="trophy" className="w-5 h-5 text-amber-400 mb-1" />
          <h4 className="text-[11px] font-black text-white">Celebration XP</h4>
          <span className="text-[9px] font-semibold text-amber-400">90 frames</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
