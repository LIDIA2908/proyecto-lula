import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  isValidGeminiApiKey,
  mintGeminiLiveToken,
} from "./scripts/gemini-live-token.mjs";

export default defineConfig(({ mode }) => {
  // Full env (not only VITE_*): the Gemini key is server-side only here
  const env = loadEnv(mode, process.cwd(), "");
  const geminiApiKey = env.VITE_GEMINI_API_KEY;

  return {
    base: "./",
    plugins: [
      react(),
      tailwindcss(),
      {
        // Dev-only endpoint that mints ephemeral tokens for the Gemini Live
        // WebSocket (production equivalent lives in server.js)
        name: "gemini-live-ephemeral-token",
        configureServer(server) {
          server.middlewares.use("/api/token", (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.end();
              return;
            }
            if (!isValidGeminiApiKey(geminiApiKey)) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Falta VITE_GEMINI_API_KEY valida en .env",
                })
              );
              return;
            }
            mintGeminiLiveToken(geminiApiKey)
              .then((data) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
              })
              .catch((err: unknown) => {
                const message =
                  err instanceof Error ? err.message : String(err ?? "error");
                res.statusCode = 502;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: message }));
              });
          });
        },
      },
    ],
    server: {
      port: 3000,
      strictPort: false,
    },
  };
});
