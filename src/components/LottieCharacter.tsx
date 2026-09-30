import React, { useEffect, useRef, useState } from "react";
import lottie, { AnimationItem } from "lottie-web";
import brujitaData from "../../public/lottie/brujita.json";

export type CharacterState =
  | "neutral"
  | "hablando"
  | "feliz"
  | "triste"
  | "sorprendido"
  | "pensativo"
  | "vocal_u"
  | "vocal_ee";

export const STATE_SEGMENTS: Record<CharacterState, [number, number]> = {
  neutral: [360, 540],     // Reposo neutral
  hablando: [330, 359],    // Hablando (AEI)
  feliz: [0, 29],          // Sonriente / EE
  triste: [121, 149],       // Seria / Boca cerrada BMP
  sorprendido: [210, 239], // Sorprendida / Vocal O
  pensativo: [150, 179],   // Pensativa / D-N-S
  vocal_u: [30, 59],       // Vocal U
  vocal_ee: [240, 269],    // Vocal F-V
};

interface LottieCharacterProps {
  noSpeak?: boolean;
  state?: CharacterState;
  size?: number;
}

const SEGMENT_NEUTRAL: [number, number] = [360, 540];
const SEGMENT_HABLAR: [number, number] = [330, 359];

export const LottieCharacter: React.FC<LottieCharacterProps> = ({ noSpeak, state, size }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [isElevenMode, setIsElevenMode] = useState(false);

  const activeSegment: [number, number] = state
    ? (STATE_SEGMENTS[state] || STATE_SEGMENTS.neutral)
    : (noSpeak ? SEGMENT_NEUTRAL : SEGMENT_HABLAR);

  // Initialize Brujita Lottie animation
  useEffect(() => {
    if (!containerRef.current) return;

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "canvas",
      loop: true,
      autoplay: false,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      animationData: brujitaData as any,
      rendererSettings: {
        clearCanvas: true,
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    animRef.current.playSegments(activeSegment, true);

    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, []);

  // Listen to ElevenLabs speech start / end events to toggle Viseme mode vs Fallback loop
  useEffect(() => {
    const handleElevenStart = () => {
      setIsElevenMode(true);
      if (animRef.current) {
        animRef.current.playSegments([121, 149], true); // BMP (closed mouth segment)
      }
    };
    const handleElevenEnd = () => {
      setIsElevenMode(false);
      if (animRef.current) {
        animRef.current.playSegments(activeSegment, true);
      }
    };

    window.addEventListener("eleven-speech-start", handleElevenStart);
    window.addEventListener("eleven-speech-end", handleElevenEnd);

    return () => {
      window.removeEventListener("eleven-speech-start", handleElevenStart);
      window.removeEventListener("eleven-speech-end", handleElevenEnd);
    };
  }, [activeSegment]);

  // Listen to Viseme Segment events from ElevenLabs Service
  useEffect(() => {
    const handleVisemeSegment = (e: Event) => {
      const customEvent = e as CustomEvent<{ segment: [number, number] }>;
      if (
        animRef.current &&
        customEvent.detail &&
        Array.isArray(customEvent.detail.segment)
      ) {
        animRef.current.setSpeed(0.68); // Slower mouth movement (68%) for clear viseme transitions
        animRef.current.playSegments(customEvent.detail.segment, true);
      }
    };

    window.addEventListener("viseme-segment", handleVisemeSegment);
    return () => {
      window.removeEventListener("viseme-segment", handleVisemeSegment);
    };
  }, []);

  // Fallback animation state when not in ElevenLabs direct Viseme mode
  useEffect(() => {
    if (!animRef.current || isElevenMode) return;

    const isSpeaking = state === "hablando" || (!state && !noSpeak);
    const speed = isSpeaking ? 0.75 : 0.85;
    animRef.current.setSpeed(speed);
    animRef.current.playSegments(activeSegment, true);
  }, [activeSegment, isElevenMode, noSpeak, state]);

  const isSpeakingAnimation = state === "hablando" || (!state && !noSpeak);

  return (
    <div className="relative flex items-center justify-center my-auto">
      {/* Lottie Animation Canvas Container with Duolingo Body Bounce */}
      <div
        ref={containerRef}
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
        className={`relative z-10 transition-all duration-300 flex items-center justify-center pointer-events-none ${
          size
            ? ""
            : "h-[36vh] sm:h-[44vh] md:h-[50vh] max-h-[460px] aspect-square min-h-[220px]"
        } ${isSpeakingAnimation ? "animate-duo-talk" : "animate-float"}`}
      />
    </div>
  );
};

