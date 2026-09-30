import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const SonarRadarComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sonar Pulse Ring 1
  const scale1 = interpolate(frame % 60, [0, 60], [0.8, 1.5]);
  const opacity1 = interpolate(frame % 60, [0, 45, 60], [0.8, 0.4, 0]);

  // Sonar Pulse Ring 2 (offset)
  const scale2 = interpolate((frame + 30) % 60, [0, 60], [0.8, 1.5]);
  const opacity2 = interpolate((frame + 30) % 60, [0, 45, 60], [0.8, 0.4, 0]);

  // Radar Beam Rotation
  const rotation = interpolate(frame % 120, [0, 120], [0, 360]);

  // Center Avatar Spring Entrance
  const avatarScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  // Floating Sparkles position
  const sparkY = Math.sin(frame / 12) * 8;

  return (
    <AbsoluteFill className="bg-transparent flex items-center justify-center overflow-hidden">
      {/* Outer Pulse Ring 1 */}
      <div
        className="absolute rounded-full border-2 border-emerald-400 pointer-events-none"
        style={{
          width: 240,
          height: 240,
          transform: `scale(${scale1})`,
          opacity: opacity1,
        }}
      />

      {/* Outer Pulse Ring 2 */}
      <div
        className="absolute rounded-full border-2 border-cyan-400 pointer-events-none"
        style={{
          width: 240,
          height: 240,
          transform: `scale(${scale2})`,
          opacity: opacity2,
        }}
      />

      {/* Rotating Radar Scan Line */}
      <div
        className="absolute w-64 h-64 rounded-full border border-emerald-500/30 pointer-events-none flex items-center justify-center"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div
          className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gradient-to-tr from-emerald-500/40 via-emerald-400/10 to-transparent origin-bottom-left"
          style={{
            clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
          }}
        />
      </div>

      {/* Center Avatar Badge with Spring & Floating motion */}
      <div
        className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-slate-900 border-4 border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.5)] overflow-hidden flex items-center justify-center"
        style={{
          transform: `scale(${avatarScale}) translateY(${sparkY}px)`,
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}icons/elfo-llamada.png`}
          alt="Elfo Sabio Remotion"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </AbsoluteFill>
  );
};
