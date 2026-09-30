// Type declaration for browser Web Speech API
declare global {
  interface Window {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    SpeechRecognition: any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    webkitSpeechRecognition: any;
  }
}

import {
  generateElevenLabsSpeech,
  getElevenLabsApiKey,
  playElevenLabsSpeech,
  stopElevenLabsSpeech,
} from "./elevenLabsService";

export async function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  // If ElevenLabs API Key is present, try ElevenLabs HD voice with Viseme timestamps!
  if (getElevenLabsApiKey()) {
    try {
      const result = await generateElevenLabsSpeech(text);
      if (result && result.audioUrl) {
        playElevenLabsSpeech(result.audioUrl, result.visemeTimeline, onStart, onEnd);
        return;
      }
    } catch (e) {
      console.warn("ElevenLabs TTS failed, falling back to browser Web Speech API:", e);
    }
  }

  // Fallback to browser Web Speech API
  speakWebSpeechText(text, onStart, onEnd);
}

export function speakWebSpeechText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onStart) onStart();
    if (onEnd) onEnd();
    return;
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();
  } catch (e) {
    // Ignore cancel errors
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.pitch = 1.25; // Upbeat Elf voice pitch
  utterance.rate = 0.82; // Slower speech rate (82%)

  // Try to find a Spanish voice
  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find(
    (v) => v.lang.startsWith("es") || v.lang.includes("es-ES") || v.lang.includes("es-MX")
  );
  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  let hasStarted = false;
  const safeStart = () => {
    if (!hasStarted) {
      hasStarted = true;
      if (onStart) onStart();
    }
  };

  let hasEnded = false;
  const safeEnd = () => {
    if (!hasEnded) {
      hasEnded = true;
      if (onEnd) onEnd();
    }
  };

  utterance.onstart = () => {
    safeStart();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("speech-start"));
    }
  };

  utterance.onboundary = (event) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("speech-boundary", {
          detail: { charIndex: event.charIndex, name: event.name },
        })
      );
    }
  };

  // Calculate estimated speaking duration (min 6.0s, 85ms per character)
  const durationMs = Math.max(6000, text.length * 85);
  const fallbackTimer = setTimeout(() => {
    safeEnd();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("speech-end"));
    }
  }, durationMs);

  utterance.onend = () => {
    clearTimeout(fallbackTimer);
    safeEnd();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("speech-end"));
    }
  };

  utterance.onerror = () => {
    clearTimeout(fallbackTimer);
    safeEnd();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("speech-end"));
    }
  };

  // Trigger onStart when speech synthesis starts
  safeStart();
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  stopElevenLabsSpeech();
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    window.dispatchEvent(new CustomEvent("speech-end"));
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
let currentRecognition: any = null;

export function listenToUserSpeech(
  onResult: (transcript: string) => void,
  onError?: (err: string) => void
): boolean {
  if (typeof window === "undefined") return false;

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) {
    if (onError) onError("El navegador no soporta reconocimiento de voz. Usa la barra de texto.");
    return false;
  }

  try {
    if (currentRecognition) {
      currentRecognition.stop();
    }

    const recognition = new SpeechRecognitionClass();
    currentRecognition = recognition;
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    recognition.onerror = (event: any) => {
      if (onError) onError(event.error || "Error al escuchar micrófono");
    };

    recognition.start();
    return true;
  } catch (err) {
    if (onError) onError("No se pudo acceder al micrófono");
    return false;
  }
}
