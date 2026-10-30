/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  /** Modelo de Gemini Live API (por defecto: gemini-3.8-live) */
  readonly VITE_GEMINI_LIVE_MODEL?: string;
  /** Voz pregrabada de la Live API (por defecto: Puck) */
  readonly VITE_GEMINI_LIVE_VOICE?: string;
  /** Endpoint de tokens efimeros (por defecto: /api/token) */
  readonly VITE_GEMINI_LIVE_TOKEN_URL?: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
