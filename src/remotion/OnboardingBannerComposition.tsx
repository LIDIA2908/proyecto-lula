import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "../components/Icon";

export const OnboardingBannerComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating vertical bounce for main avatar
  const avatarY = Math.sin(frame / 15) * 10;
  const avatarRotate = Math.sin(frame / 20) * 4;

  // Spring entrance animations for feature pills
  const pill1Scale = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12 } });
  const pill2Scale = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12 } });
  const pill3Scale = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12 } });

  // Glowing backdrop pulse
  const glowOpacity = interpolate(frame % 40, [0, 20, 40], [0.3, 0.7, 0.3]);

  return (
    <AbsoluteFill className="bg-transparent flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div
        className="absolute w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
        style={{ opacity: glowOpacity }}
      />

      {/* Main Remotion Hero Avatar */}
      <div
        className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-900 border-4 border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.6)] overflow-hidden mb-4"
        style={{
          transform: `translateY(${avatarY}px) rotate(${avatarRotate}deg)`,
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}icons/elfo-llamada.png`}
          alt="Elfo Sabio Remotion"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Remotion Staggered Feature Badges */}
      <div className="flex flex-wrap justify-center gap-2 max-w-sm z-10">
        <span
          className="bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
          style={{ transform: `scale(${pill1Scale})` }}
        >
          <Icon name="sparkles" className="w-3.5 h-3.5 text-emerald-400" />
          <span>Remotion 4.0 Animated</span>
        </span>
        <span
          className="bg-slate-900/90 border border-slate-700 text-cyan-300 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
          style={{ transform: `scale(${pill2Scale})` }}
        >
          <Icon name="brain" className="w-3.5 h-3.5 text-cyan-400" />
          <span>Gemini 3.6 AI</span>
        </span>
        <span
          className="bg-slate-900/90 border border-slate-700 text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
          style={{ transform: `scale(${pill3Scale})` }}
        >
          <Icon name="microphone" className="w-3.5 h-3.5" colorClass="bg-amber-400" />
          <span>Voz & Traducción</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
