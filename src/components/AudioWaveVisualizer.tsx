import React from "react";

interface AudioWaveVisualizerProps {
  frequencies?: number[];
  isMuted?: boolean;
  isSpeaking?: boolean;
  barCount?: number;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  frequencies = [0.15, 0.15, 0.15, 0.15, 0.15],
  isMuted = false,
  isSpeaking = false,
  barCount = 5,
  className = "h-4 sm:h-5",
  activeColor = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  inactiveColor = "bg-slate-600/60",
}) => {
  return (
    <div className={`flex items-end justify-center gap-0.5 sm:gap-1 px-1 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => {
        const freqVal = frequencies[i % frequencies.length] || 0.15;
        // Height scale between 15% (idle) and 100% (peak voice)
        const heightPct = isMuted ? 15 : Math.max(18, Math.min(100, freqVal * 100));

        return (
          <span
            key={i}
            className={`w-0.5 sm:w-1 rounded-full transition-all duration-75 ${
              isMuted
                ? "bg-red-500/40"
                : isSpeaking
                ? activeColor
                : inactiveColor
            }`}
            style={{
              height: `${heightPct}%`,
            }}
          />
        );
      })}
    </div>
  );
};
