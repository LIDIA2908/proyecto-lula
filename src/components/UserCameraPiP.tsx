import React, { useEffect, useRef, useState } from "react";
import { useMicrophoneVolume } from "../hooks/useMicrophoneVolume";
import { AudioWaveVisualizer } from "./AudioWaveVisualizer";
import { Icon } from "./Icon";

interface UserCameraPiPProps {
  isMuted: boolean;
  isVideoOff: boolean;
}

export const UserCameraPiP: React.FC<UserCameraPiPProps> = ({
  isMuted,
  isVideoOff,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const { frequencies, isSpeaking } = useMicrophoneVolume(!isMuted);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (!isVideoOff && typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setHasCameraAccess(true);
        })
        .catch(() => {
          setHasCameraAccess(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOff]);

  return (
    <div className="absolute top-14 right-2 sm:top-20 sm:right-4 md:top-24 md:right-6 z-30 w-20 h-28 sm:w-28 sm:h-36 md:w-36 md:h-48 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105">
      {!isVideoOff && hasCameraAccess ? (
        /* eslint-disable-next-line @remotion/warn-native-media-tag */
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        /* Fallback avatar preview */
        <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-2 sm:p-3 relative">
          <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-xl">
            <Icon name="user" className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
          </div>
          <span className="text-[10px] sm:text-xs font-black text-white mt-1.5 sm:mt-2 tracking-wider uppercase bg-slate-950/80 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-slate-800">
            Tú
          </span>
        </div>
      )}

      {/* Floating Status Badge with Real-Time Audio Waves */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-2 py-1 sm:px-2.5 sm:py-1 rounded-full border border-slate-800 shadow-xl">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              isMuted ? "bg-red-500" : isSpeaking ? "bg-emerald-400 animate-ping" : "bg-emerald-400"
            }`}
          />
          <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-200 uppercase">
            {isMuted ? "MUTE" : isSpeaking ? "HABLANDO" : "LIVE"}
          </span>
        </div>

        {/* Dynamic Equalizer Audio Wave Visualizer */}
        {!isMuted && (
          <AudioWaveVisualizer
            frequencies={frequencies}
            isMuted={isMuted}
            isSpeaking={isSpeaking}
            barCount={4}
            className="h-3 sm:h-3.5"
            activeColor="bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]"
          />
        )}
      </div>
    </div>
  );
};


