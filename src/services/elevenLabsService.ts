// Service to interact with ElevenLabs Text-to-Speech API with Viseme Timestamps

export interface VisemeFrameEvent {
  timeMs: number;
  segment: [number, number];
  char: string;
}

export interface ElevenLabsSpeechResult {
  audioUrl: string;
  visemeTimeline: VisemeFrameEvent[];
}

export const BRUJITA_SEGMENTS: Record<string, [number, number]> = {
  neutral: [360, 540],
  BMP: [121, 149],  // Silence / M, B, P (closed mouth)
  AEI: [330, 359],  // A, E
  O: [210, 239],    // O
  U: [30, 59],      // U
  EE: [0, 29],      // I, Y
  FV: [240, 269],   // F, V
  CDN: [150, 179],  // C, D, N, S, T
  CH: [180, 209],   // CH, J
  ELE: [300, 329],  // E, L
  LL: [60, 89],     // L, LL
  QW: [270, 299],   // Q, W, K
  TH: [90, 119],    // Z, TH
};

// Map Spanish characters to Brujita Lottie segment tuples [start, end]:
export function charToLottieSegment(char: string): [number, number] {
  const c = char.toLowerCase();
  if (!c || " .,!?¡¿\n\t-".includes(c)) return BRUJITA_SEGMENTS.BMP;
  if ("mbp".includes(c)) return BRUJITA_SEGMENTS.BMP;
  if ("aá".includes(c)) return BRUJITA_SEGMENTS.AEI;
  if ("eé".includes(c)) return BRUJITA_SEGMENTS.ELE;
  if ("oó".includes(c)) return BRUJITA_SEGMENTS.O;
  if ("uú".includes(c)) return BRUJITA_SEGMENTS.U;
  if ("iyí".includes(c)) return BRUJITA_SEGMENTS.EE;
  if ("fv".includes(c)) return BRUJITA_SEGMENTS.FV;
  if ("chj".includes(c)) return BRUJITA_SEGMENTS.CH;
  if ("l".includes(c)) return BRUJITA_SEGMENTS.LL;
  if ("qkwrx".includes(c)) return BRUJITA_SEGMENTS.QW;
  if ("z".includes(c)) return BRUJITA_SEGMENTS.TH;
  return BRUJITA_SEGMENTS.CDN;
}

// Memory fallback / runtime API Key storage
let runtimeApiKey: string | null = null;
let runtimeVoiceId: string | null = null;

export function setElevenLabsCredentials(apiKey: string, voiceId?: string) {
  runtimeApiKey = apiKey;
  if (voiceId) runtimeVoiceId = voiceId;
}

export function getElevenLabsApiKey(): string | null {
  const key = runtimeApiKey || import.meta.env.VITE_ELEVENLABS_API_KEY || null;
  return key && typeof key === "string" && key.trim().length > 0 ? key.trim() : null;
}

export function getElevenLabsVoiceId(): string {
  return (
    runtimeVoiceId ||
    import.meta.env.VITE_ELEVENLABS_VOICE_ID ||
    "21m00Tcm4TlvDq8ikWAM" // Default upbeat Rachel voice ID
  );
}

/**
 * Call ElevenLabs API with timestamps and generate Viseme timeline
 */
export async function generateElevenLabsSpeech(
  text: string
): Promise<ElevenLabsSpeechResult | null> {
  const apiKey = getElevenLabsApiKey();
  if (!apiKey) return null;

  const voiceId = getElevenLabsVoiceId();
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("ElevenLabs API Notice:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    if (!data.audio_base64 || !data.alignment) return null;

    // Convert Base64 MP3 to Blob URL
    const binaryString = atob(data.audio_base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(blob);

    // Build Viseme timeline from character timestamps
    const characters: string[] = data.alignment.characters || [];
    const startTimes: number[] = data.alignment.character_start_times_seconds || [];

    const visemeTimeline: VisemeFrameEvent[] = characters.map((char, index) => {
      const timeMs = Math.round((startTimes[index] || 0) * 1000);
      const segment = charToLottieSegment(char);
      return { timeMs, segment, char };
    });

    return { audioUrl, visemeTimeline };
  } catch (err) {
    console.error("ElevenLabs fetch error:", err);
    return null;
  }
}

let currentAudio: HTMLAudioElement | null = null;
let visemeRafId: number | null = null;

/**
 * Play ElevenLabs Audio and dispatch real-time Viseme segments to LottieCharacter
 */
export function playElevenLabsSpeech(
  audioUrl: string,
  visemeTimeline: VisemeFrameEvent[],
  onStart?: () => void,
  onEnd?: () => void
) {
  stopElevenLabsSpeech();

  const audio = new Audio(audioUrl);
  audio.playbackRate = 0.80; // Slower playback rate (80%) for clear, deliberate speech and viseme legibility
  currentAudio = audio;

  audio.onplay = () => {
    if (onStart) onStart();
    window.dispatchEvent(new CustomEvent("speech-start"));
    window.dispatchEvent(new CustomEvent("eleven-speech-start"));

    let lastSegStr = "";

    const updateVisemeFrame = () => {
      if (!currentAudio || currentAudio.paused || currentAudio.ended) return;
      const currentMs = currentAudio.currentTime * 1000;

      // Find active viseme at current playback time
      let activeViseme: VisemeFrameEvent | undefined;
      for (let i = visemeTimeline.length - 1; i >= 0; i--) {
        if (visemeTimeline[i].timeMs <= currentMs) {
          activeViseme = visemeTimeline[i];
          break;
        }
      }
      const segment = activeViseme ? activeViseme.segment : BRUJITA_SEGMENTS.BMP;
      const segStr = `${segment[0]},${segment[1]}`;

      if (segStr !== lastSegStr) {
        lastSegStr = segStr;
        window.dispatchEvent(
          new CustomEvent("viseme-segment", { detail: { segment } })
        );
      }

      visemeRafId = requestAnimationFrame(updateVisemeFrame);
    };

    visemeRafId = requestAnimationFrame(updateVisemeFrame);
  };

  audio.onended = () => {
    stopElevenLabsSpeech();
    if (onEnd) onEnd();
  };

  audio.onerror = () => {
    stopElevenLabsSpeech();
    if (onEnd) onEnd();
  };

  audio.play().catch(() => {
    stopElevenLabsSpeech();
    if (onEnd) onEnd();
  });
}

export function stopElevenLabsSpeech() {
  if (visemeRafId !== null) {
    cancelAnimationFrame(visemeRafId);
    visemeRafId = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  window.dispatchEvent(new CustomEvent("speech-end"));
  window.dispatchEvent(new CustomEvent("eleven-speech-end"));
  window.dispatchEvent(new CustomEvent("viseme-frame", { detail: { frame: 63 } }));
}
