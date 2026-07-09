import app from "./app";
import { PORT } from "./config/env";
import { prisma } from "./config/prisma";
import http from "http";
import { initializeWebSocket } from "./websockets/websockets.server";
import { initializeWebSocketListener } from "./stream/websocket.listener";

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();

    console.log("✅ Connected to PostgreSQL");

    const server = http.createServer(app);

    initializeWebSocket(server);

    initializeWebSocketListener();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);

    process.exit(1);
  }
}

startServer();
