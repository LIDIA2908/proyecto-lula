import { useEffect, useState } from "react";

export interface MicrophoneVolumeData {
  volume: number;
  frequencies: number[];
  isSpeaking: boolean;
}

export function useMicrophoneVolume(isActive: boolean): MicrophoneVolumeData {
  const [volume, setVolume] = useState<number>(0);
  const [frequencies, setFrequencies] = useState<number[]>([0.1, 0.1, 0.1, 0.1, 0.1]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive || typeof window === "undefined" || !navigator.mediaDevices) {
      setVolume(0);
      setFrequencies([0.1, 0.1, 0.1, 0.1, 0.1]);
      setIsSpeaking(false);
      return;
    }

    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let micStream: MediaStream | null = null;
    let animFrameId: number | null = null;

    async function initAudio() {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioCtxClass();
        
        const source = audioCtx.createMediaStreamSource(micStream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 32;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateData = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);

          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const avg = sum / bufferLength;
          const normalizedVol = Math.min(1, avg / 100);

          setVolume(normalizedVol);
          setIsSpeaking(normalizedVol > 0.08);

          // Sample 5 frequency bins for wave bars
          const b1 = Math.min(1, (dataArray[1] || 10) / 160);
          const b2 = Math.min(1, (dataArray[3] || 15) / 160);
          const b3 = Math.min(1, (dataArray[5] || 20) / 160);
          const b4 = Math.min(1, (dataArray[7] || 15) / 160);
          const b5 = Math.min(1, (dataArray[9] || 10) / 160);

          setFrequencies([b1, b2, b3, b4, b5]);

          animFrameId = requestAnimationFrame(updateData);
        };

        updateData();
      } catch (err) {
        console.warn("Microphone audio visualizer notice:", err);
      }
    }

    initAudio();

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (micStream) micStream.getTracks().forEach((track) => track.stop());
      if (audioCtx && audioCtx.state !== "closed") audioCtx.close();
    };
  }, [isActive]);

  return { volume, frequencies, isSpeaking };
}
