// Gemini Live API realtime voice for Lula (default model: gemini-3.8-live).
// The browser connects directly to the Live WebSocket using VITE_GEMINI_API_KEY
// (same key the app already uses client-side for generateContent).
// Modeled after gemini-live-ephemeral-tokens-websocket/frontend/geminilive.js
// and mediaUtils.js from the parent repo.

import { CharacterState } from "../components/LottieCharacter";
import { charToLottieSegment } from "./elevenLabsService";

const DEFAULT_LIVE_MODEL = "gemini-3.8-live";
const DEFAULT_LIVE_VOICE = "Puck";

const CAPTURE_SAMPLE_RATE = 16000; // Gemini requires 16kHz input
const PLAYBACK_SAMPLE_RATE = 24000; // Gemini outputs 24kHz audio

const LIVE_WS_BASE =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained";

// Viseme tick cadence and speech-end watchdog
const VISEME_TICK_MS = 90;
const END_WATCHDOG_MS = 200;
const END_TOLERANCE_S = 0.08;
const FALLBACK_CHAR_RATE = 14; // chars/second estimate before audio calibration

export const LULA_LIVE_SYSTEM_INSTRUCTIONS = `Eres Lula, una asistente virtual inteligente, simpática y divertida que está en una videollamada interactiva con el usuario. Respondes a TODO TIPO DE PREGUNTAS en español.

REGLAS DE RESPUESTA:
1. Tu voz se reproduce en tiempo real: habla natural y conversacional, máximo 2-3 oraciones cortas. Sin listas, sin markdown, sin emojis y sin escribir cosas que no debas decir en voz alta.
2. Al final de CADA respuesta agrega exactamente UNO de los siguientes estados entre llaves según el tono:
   - {feliz} para datos alegres, curiosidades fascinantes, logros o respuestas entusiastas.
   - {triste} para tragedias, desastres, extinciones o temas tristes.
   - {hablando} para explicaciones, conceptos, tecnología o definiciones estándar.
   - {neutral} para datos formales o cálculos neutros.`;

export interface GeminiLiveCallbacks {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onSpeaking?: (speaking: boolean) => void;
  onThinking?: (thinking: boolean) => void;
  onSubtitle?: (text: string) => void;
  onEmotion?: (emotion: CharacterState) => void;
  onError?: (message: string) => void;
}

interface LivePart {
  inlineData?: { mimeType?: string; data?: string };
  text?: string;
}

interface LiveServerContent {
  modelTurn?: { parts?: LivePart[] };
  outputTranscription?: { text?: string; finished?: boolean };
  inputTranscription?: { text?: string; finished?: boolean };
  interrupted?: boolean;
  turnComplete?: boolean;
}

interface LiveServerMessage {
  setupComplete?: unknown;
  serverContent?: LiveServerContent;
  error?: { message?: string };
}

export function getGeminiLiveModel(): string {
  const model = import.meta.env.VITE_GEMINI_LIVE_MODEL;
  return model && model.trim() !== "" ? model.trim() : DEFAULT_LIVE_MODEL;
}

export function getGeminiLiveVoice(): string {
  const voice = import.meta.env.VITE_GEMINI_LIVE_VOICE;
  return voice && voice.trim() !== "" ? voice.trim() : DEFAULT_LIVE_VOICE;
}

export function getGeminiLiveApiKey(): string | null {
  const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey =
    rawKey && typeof rawKey === "string" && rawKey.trim() !== "" && !rawKey.includes("tu_clave")
      ? rawKey.trim()
      : null;
  return apiKey;
}

export function isGeminiLiveAvailable(): boolean {
  return (
    typeof WebSocket !== "undefined" &&
    typeof import.meta !== "undefined" &&
    getGeminiLiveApiKey() !== null
  );
}

/** Float32 samples -> 16-bit PCM little-endian, base64-encoded */
function floatTo16BitPcmBase64(input: Float32Array): string {
  const bytes = new Uint8Array(input.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** base64 16-bit PCM -> Float32 samples for the playback worklet */
function base64ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const view = new DataView(bytes.buffer);
  const floats = new Float32Array(bytes.length / 2);
  for (let i = 0; i < floats.length; i++) {
    floats[i] = view.getInt16(i * 2, true) / 32768;
  }
  return floats;
}

/** Removes complete {feliz}-style emotion tags plus any trailing partial tag */
function stripEmotionTags(text: string): string {
  return text
    .replace(/\{feliz\}|\{triste\}|\{hablando\}|\{neutral\}/g, "")
    .replace(/\{[a-z]*$/g, "")
    .trimStart();
}

export class GeminiLiveCall {
  private callbacks: GeminiLiveCallbacks;
  private model: string;
  private voiceName: string;

  private ws: WebSocket | null = null;
  private connected = false;

  // Mic capture pipeline (16kHz)
  private micStream: MediaStream | null = null;
  private captureCtx: AudioContext | null = null;
  private captureSource: MediaStreamAudioSourceNode | null = null;
  private muted = false;

  // Playback pipeline (24kHz)
  private playbackCtx: AudioContext | null = null;
  private playbackNode: AudioWorkletNode | null = null;

  // Speech / viseme tracking
  private speaking = false;
  private playbackHead = 0; // AudioContext clock position where queued audio ends
  private speechStartPos = 0;
  private transcript = ""; // cleaned output transcription of current turn
  private visemeCursor = 0; // float index into transcript
  private visemeTimer: number | null = null;
  private endWatchdog: number | null = null;

  constructor(callbacks: GeminiLiveCallbacks) {
    this.callbacks = callbacks;
    this.model = getGeminiLiveModel();
    this.voiceName = getGeminiLiveVoice();
  }

  isConnected(): boolean {
    return this.connected && this.ws?.readyState === WebSocket.OPEN;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  async connect(): Promise<void> {
    const apiKey = getGeminiLiveApiKey();
    if (!apiKey) throw new Error("Falta VITE_GEMINI_API_KEY para Gemini Live");
    if (this.ws) return;

    await this.setupPlaybackPipeline();

    return new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(`${LIVE_WS_BASE}?access_token=${apiKey}`);
      this.ws = ws;

      const timeout = window.setTimeout(() => {
        reject(new Error("Tiempo de espera agotado al conectar con Gemini Live"));
      }, 12000);

      ws.onopen = () => {
        this.sendSetup();
      };

      ws.onerror = () => {
        window.clearTimeout(timeout);
        this.connected = false;
        this.callbacks.onError?.("No se pudo conectar con Gemini Live");
        reject(new Error("WebSocket error"));
      };

      ws.onclose = () => {
        window.clearTimeout(timeout);
        this.connected = false;
        // Report only unexpected drops (disconnect() nulls this.ws first)
        if (this.ws === ws) {
          this.ws = null;
          this.endSpeech();
          this.callbacks.onDisconnected?.();
        }
      };

      ws.onmessage = (event) => {
        void this.handleMessage(event, timeout, resolve, reject);
      };
    });
  }

  disconnect(): void {
    this.stopSpeechTracking();
    if (this.endWatchdog !== null) {
      window.clearInterval(this.endWatchdog);
      this.endWatchdog = null;
    }
    const ws = this.ws;
    this.ws = null; // prevents the onclose handler from reporting the drop
    ws?.close();
    this.connected = false;

    this.micStream?.getTracks().forEach((track) => track.stop());
    this.micStream = null;
    this.captureSource?.disconnect();
    this.captureSource = null;
    void this.captureCtx?.close();
    this.captureCtx = null;

    this.playbackNode = null;
    void this.playbackCtx?.close();
    this.playbackCtx = null;
  }

  /** Sends a typed question as a user turn */
  sendText(text: string): void {
    if (!this.isConnected()) return;
    this.setThinking(true);
    this.ws?.send(
      JSON.stringify({
        clientContent: {
          turns: [{ role: "user", parts: [{ text }] }],
          turnComplete: true,
        },
      })
    );
  }

  /** Local barge-in: cuts current playback so Lula can hear a new turn */
  interruptPlayback(): void {
    if (!this.speaking) return;
    this.playbackNode?.port.postMessage("interrupt");
    this.playbackHead = this.playbackCtx?.currentTime ?? 0;
    this.endSpeech();
  }

  private sendSetup(): void {
    if (!this.ws) return;
    const setup = {
      model: `models/${this.model}`,
      generationConfig: {
        responseModalities: ["AUDIO"],
        temperature: 1.0,
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: this.voiceName },
          },
        },
      },
      systemInstruction: { parts: [{ text: LULA_LIVE_SYSTEM_INSTRUCTIONS }] },
      outputAudioTranscription: {},
      inputAudioTranscription: {},
      realtimeInputConfig: {
        automaticActivityDetection: {
          disabled: false,
          silenceDurationMs: 1500,
          prefixPaddingMs: 500,
          endOfSpeechSensitivity: "END_SENSITIVITY_UNSPECIFIED",
          startOfSpeechSensitivity: "START_SENSITIVITY_UNSPECIFIED",
        },
        activityHandling: "ACTIVITY_HANDLING_UNSPECIFIED",
        turnCoverage: "TURN_INCLUDES_ONLY_ACTIVITY",
      },
    };
    this.ws.send(JSON.stringify({ setup }));
  }

  private async handleMessage(
    event: MessageEvent,
    connectTimeout: number,
    resolve: () => void,
    reject: (reason: Error) => void
  ): Promise<void> {
    let raw: string;
    if (event.data instanceof Blob) {
      raw = await event.data.text();
    } else if (event.data instanceof ArrayBuffer) {
      raw = new TextDecoder().decode(event.data);
    } else {
      raw = event.data;
    }

    let msg: LiveServerMessage;
    try {
      msg = JSON.parse(raw) as LiveServerMessage;
    } catch {
      return;
    }

    if (msg.error) {
      if (connectTimeout) window.clearTimeout(connectTimeout);
      this.callbacks.onError?.(msg.error.message || "Error de Gemini Live");
      reject(new Error(msg.error.message || "Gemini Live error"));
      return;
    }

    // Setup confirmed: start streaming the mic and resolve connect()
    if (msg.setupComplete !== undefined) {
      window.clearTimeout(connectTimeout);
      this.connected = true;
      try {
        await this.setupMicPipeline();
        resolve();
        this.callbacks.onConnected?.();
      } catch {
        // Mic denied: stay connected for typed questions only
        resolve();
        this.callbacks.onConnected?.();
        this.callbacks.onError?.("Sin micrófono: solo preguntas por texto");
      }
      return;
    }

    const content = msg.serverContent;
    if (!content) return;

    // User finished speaking (VAD) -> Lula is thinking
    if (content.inputTranscription?.finished) {
      this.setThinking(true);
    }

    // Model barge-in: user started talking over Lula
    if (content.interrupted) {
      this.playbackNode?.port.postMessage("interrupt");
      this.playbackHead = this.playbackCtx?.currentTime ?? 0;
      this.endSpeech();
    }

    // Native audio chunks
    const parts = content.modelTurn?.parts;
    if (parts?.length) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          this.enqueueAudio(part.inlineData.data);
        }
      }
    }

    // Output transcription drives subtitles, emotion tags and lip-sync
    if (content.outputTranscription?.text) {
      this.transcript += content.outputTranscription.text;
      const emotion = this.detectEmotion(this.transcript);
      if (emotion) this.callbacks.onEmotion?.(emotion);
      const visible = stripEmotionTags(this.transcript);
      if (visible) this.callbacks.onSubtitle?.(visible);
    }

    if (content.turnComplete && !this.speaking) {
      this.setThinking(false);
    }
  }

  private detectEmotion(text: string): CharacterState | null {
    if (text.includes("{feliz}")) return "feliz";
    if (text.includes("{triste}")) return "triste";
    if (text.includes("{hablando}")) return "hablando";
    if (text.includes("{neutral}")) return "neutral";
    return null;
  }

  // ---- Audio pipelines -------------------------------------------------

  private async setupPlaybackPipeline(): Promise<void> {
    if (this.playbackCtx) return;
    const ctx = new AudioContext({ sampleRate: PLAYBACK_SAMPLE_RATE });
    await ctx.audioWorklet.addModule(
      `${import.meta.env.BASE_URL}audio-processors/playback.worklet.js`
    );
    const node = new AudioWorkletNode(ctx, "pcm-processor");
    const gain = ctx.createGain();
    gain.gain.value = 1.0;
    node.connect(gain);
    gain.connect(ctx.destination);
    if (ctx.state === "suspended") await ctx.resume();
    this.playbackCtx = ctx;
    this.playbackNode = node;

    this.endWatchdog = window.setInterval(() => {
      if (
        this.speaking &&
        this.playbackCtx &&
        this.playbackCtx.currentTime >= this.playbackHead - END_TOLERANCE_S
      ) {
        this.endSpeech();
      }
    }, END_WATCHDOG_MS);
  }

  private async setupMicPipeline(): Promise<void> {
    if (this.captureCtx) return;
    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: CAPTURE_SAMPLE_RATE,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    const ctx = new AudioContext({ sampleRate: CAPTURE_SAMPLE_RATE });
    await ctx.audioWorklet.addModule(
      `${import.meta.env.BASE_URL}audio-processors/capture.worklet.js`
    );
    const node = new AudioWorkletNode(ctx, "audio-capture-processor");
    node.port.onmessage = (event) => {
      if (this.muted || !this.isConnected()) return;
      if (event.data?.type === "audio" && event.data.data instanceof Float32Array) {
        this.ws?.send(
          JSON.stringify({
            realtimeInput: {
              audio: {
                mimeType: "audio/pcm;rate=16000",
                data: floatTo16BitPcmBase64(event.data.data),
              },
            },
          })
        );
      }
    };
    if (ctx.state === "suspended") await ctx.resume();
    const source = ctx.createMediaStreamSource(this.micStream);
    source.connect(node);
    this.captureCtx = ctx;
    this.captureSource = source;
  }

  // ---- Speech / viseme tracking ----------------------------------------

  private enqueueAudio(base64Pcm: string): void {
    if (!this.playbackCtx || !this.playbackNode) return;
    const floats = base64ToFloat32(base64Pcm);
    this.playbackNode.port.postMessage(floats);

    const ctx = this.playbackCtx;
    this.playbackHead =
      Math.max(ctx.currentTime, this.playbackHead) + floats.length / PLAYBACK_SAMPLE_RATE;

    if (!this.speaking) this.startSpeech();
  }

  private startSpeech(): void {
    if (!this.playbackCtx) return;
    this.speaking = true;
    this.speechStartPos = this.playbackCtx.currentTime;
    this.visemeCursor = 0;
    this.setThinking(false);
    this.callbacks.onSpeaking?.(true);
    window.dispatchEvent(new CustomEvent("speech-start"));

    if (this.visemeTimer === null) {
      this.visemeTimer = window.setInterval(() => this.tickViseme(), VISEME_TICK_MS);
    }
  }

  private endSpeech(): void {
    this.stopSpeechTracking();
    this.speaking = false;
    this.transcript = ""; // fresh transcript for the next turn
    this.setThinking(false);
    this.callbacks.onSpeaking?.(false);
    window.dispatchEvent(new CustomEvent("speech-end"));
    window.dispatchEvent(
      new CustomEvent("viseme-frame", { detail: { frame: 63 } })
    );
  }

  private stopSpeechTracking(): void {
    if (this.visemeTimer !== null) {
      window.clearInterval(this.visemeTimer);
      this.visemeTimer = null;
    }
  }

  /**
   * Proportional lip-sync: maps playback progress to a character of the
   * output transcription. The chars-per-second rate self-corrects as more
   * audio and text stream in.
   */
  private tickViseme(): void {
    if (!this.playbackCtx || !this.speaking) return;
    const text = stripEmotionTags(this.transcript);
    if (!text) return;

    const elapsed = this.playbackCtx.currentTime - this.speechStartPos;
    const queued = this.playbackHead - this.speechStartPos;
    // Only trust the measured rate once enough audio is queued; before that
    // the transcript usually arrives ahead of the audio
    const charRate =
      queued > 0.5 ? text.length / queued : FALLBACK_CHAR_RATE;

    // Forward-only cursor keeps visemes stable when the rate estimate moves
    this.visemeCursor = Math.min(
      text.length - 1,
      Math.max(this.visemeCursor, elapsed * charRate)
    );

    const char = text[Math.floor(this.visemeCursor)] || " ";
    window.dispatchEvent(
      new CustomEvent("viseme-segment", { detail: { segment: charToLottieSegment(char) } })
    );
  }

  private setThinking(thinking: boolean): void {
    this.callbacks.onThinking?.(thinking);
  }
}
