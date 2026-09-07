import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 8080;

// Comma-separated list, e.g. "http://localhost:5173,http://localhost:5174" —
// Vite auto-bumps to the next free port when 5173 is taken by another app,
// so dev needs more than one allowed origin to keep working.
export const CORS_ORIGINS = (
  process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const WS_AUTH_TOKEN = process.env.WS_AUTH_TOKEN || "";
