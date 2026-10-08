import app from "./app";
import { PORT } from "./config/env";
import { prisma } from "./config/prisma";
import http from "http";
import { initializeWebSocket } from "./websockets/websockets.server";
import { initializeWebSocketListener } from "./stream/websocket.listener";
import { initializeDatabaseListener } from "./stream/database.listener";
import { logger } from "./utils/logger";

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();

    logger.info("Connected to PostgreSQL");

    const server = http.createServer(app);

    initializeWebSocket(server);

    initializeDatabaseListener();

    initializeWebSocketListener();

    server.listen(PORT, () => {
      logger.info("Server started", { port: PORT });
    });
  } catch (error) {
    logger.error(
      "Failed to start server",
      error instanceof Error ? error : String(error),
    );

    process.exit(1);
  }
}

startServer();
