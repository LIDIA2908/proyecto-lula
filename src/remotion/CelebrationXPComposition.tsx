import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "../components/Icon";

export const CelebrationXPComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Trophy spring scale
  const trophyScale = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.6 },
  });

  // Confetti particles outward burst
  const confettiCount = 12;

  return (
    <AbsoluteFill className="bg-transparent flex flex-col items-center justify-center pointer-events-none">
      {/* Confetti Explosion Burst */}
      {Array.from({ length: confettiCount }).map((_, i) => {
        const angle = (i * 360) / confettiCount;
        const distance = interpolate(frame % 45, [0, 45], [0, 120]);
        const opacity = interpolate(frame % 45, [0, 30, 45], [1, 0.8, 0]);
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * distance;
        const y = Math.sin(rad) * distance;

        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full shadow-lg"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              opacity,
              backgroundColor: i % 3 === 0 ? "#34d399" : i % 3 === 1 ? "#38bdf8" : "#fbbf24",
            }}
          />
        );
      })}

      {/* Main Trophy Badge */}
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-500/20 border-4 border-emerald-400 flex items-center justify-center text-5xl sm:text-6xl shadow-[0_0_40px_rgba(52,211,153,0.6)] mb-3"
        style={{ transform: `scale(${trophyScale})` }}
      >
        <Icon name="trophy" className="w-12 h-12 sm:w-14 sm:h-14 text-amber-400" />
      </div>

      <div
        className="bg-emerald-400 text-slate-950 font-black text-lg px-4 py-1 rounded-full shadow-2xl tracking-wider uppercase"
        style={{ transform: `scale(${trophyScale})` }}
      >
        +30 XP GANADOS
      </div>
    </AbsoluteFill>
  );
};
