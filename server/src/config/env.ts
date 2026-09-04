import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 8080;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
export const WS_AUTH_TOKEN = process.env.WS_AUTH_TOKEN || "";
