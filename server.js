import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  isValidGeminiApiKey,
  mintGeminiLiveToken,
} from "./scripts/gemini-live-token.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, "dist");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function handleTokenRequest(req, res) {
  if (!isValidGeminiApiKey(GEMINI_API_KEY)) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Falta GEMINI_API_KEY valida en el entorno" }));
    return;
  }
  mintGeminiLiveToken(GEMINI_API_KEY)
    .then((data) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    })
    .catch((err) => {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(err?.message || err) }));
    });
}

const server = http.createServer((req, res) => {
  // Ephemeral token endpoint for the Gemini Live API WebSocket
  if (req.method === "POST" && (req.url || "/").split("?")[0] === "/api/token") {
    handleTokenRequest(req, res);
    return;
  }

  let reqPath = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = path.join(DIST_DIR, reqPath);

  // Prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || stats.isDirectory()) {
      // SPA Fallback to index.html for client-side routing
      filePath = path.join(DIST_DIR, "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end("Server Error");
        return;
      }
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=2592000",
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor listo y corriendo en puerto ${PORT}`);
});
