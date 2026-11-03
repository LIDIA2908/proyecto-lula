// Mints an ephemeral Gemini Live API auth token (server-side only).
// Used by the Vite dev middleware and by server.js in production.
// REST shape mirrors google-genai SDK client.auth_tokens.create():
// POST /v1beta/auth_tokens with flat fields (not nested under "config").

const AUTH_TOKENS_URL =
  "https://generativelanguage.googleapis.com/v1beta/auth_tokens";

const TOKEN_LIFETIME_MINUTES = 30;
const NEW_SESSION_WINDOW_MINUTES = 1;

export function isValidGeminiApiKey(apiKey) {
  return (
    typeof apiKey === "string" &&
    apiKey.trim() !== "" &&
    !apiKey.includes("tu_clave")
  );
}

export async function mintGeminiLiveToken(apiKey) {
  const now = Date.now();
  const iso = (ms) => new Date(ms).toISOString();

  const res = await fetch(AUTH_TOKENS_URL, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uses: 1,
      expireTime: iso(now + TOKEN_LIFETIME_MINUTES * 60 * 1000),
      newSessionExpireTime: iso(now + NEW_SESSION_WINDOW_MINUTES * 60 * 1000),
    }),
  });

  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    // Non-JSON error body
  }

  if (!res.ok || !data?.name) {
    throw new Error(
      `CreateAuthToken fallo (${res.status}): ${text.slice(0, 200) || "sin detalle"}`
    );
  }

  return { token: data.name, expiresAt: iso(now + TOKEN_LIFETIME_MINUTES * 60 * 1000) };
}
