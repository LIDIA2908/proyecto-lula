// Type declarations for scripts/gemini-live-token.mjs
export function isValidGeminiApiKey(apiKey: unknown): boolean;
export function mintGeminiLiveToken(
  apiKey: string
): Promise<{ token: string; expiresAt: string }>;
