import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { URL } from "url";
import { WS_AUTH_TOKEN } from "../config/env";
import { logger } from "../utils/logger";

interface ClientInfo {
  socket: WebSocket;
  patientId?: string;
  isAlive: boolean;
}

const clients = new Set<ClientInfo>();

const HEARTBEAT_INTERVAL_MS = 30000;
const MAX_BUFFERED_BYTES = 1_000_000; // backpressure threshold before dropping a sample

let wss: WebSocketServer;
let heartbeatInterval: NodeJS.Timeout;

export const initializeWebSocket = (server: any) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
    if (WS_AUTH_TOKEN) {
      const url = new URL(req.url ?? "", "http://localhost");
      const token = url.searchParams.get("token");

      if (token !== WS_AUTH_TOKEN) {
        logger.warn("WebSocket connection rejected: invalid or missing token");
        socket.close(1008, "Unauthorized");
        return;
      }
    }

    const client: ClientInfo = { socket, isAlive: true };

    clients.add(client);
    logger.info("WebSocket client connected", { totalClients: clients.size });

    socket.on("pong", () => {
      client.isAlive = true;
    });

    socket.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "SUBSCRIBE") {
          client.patientId = data.patientId;
          logger.info("Client subscribed to patient", { patientId: data.patientId });
        }
      } catch (err) {
        logger.error("Failed to parse WebSocket message", err);
      }
    });

    socket.on("error", (err) => {
      logger.error("WebSocket client error", err);
      clients.delete(client);
    });

    socket.on("close", () => {
      clients.delete(client);
      logger.info("WebSocket client disconnected", { totalClients: clients.size });
    });
  });

  // Heartbeat: ping every client periodically and drop anyone that didn't
  // pong back since the last check, so dead connections don't linger forever.
  heartbeatInterval = setInterval(() => {
    clients.forEach((client) => {
      if (!client.isAlive) {
        logger.warn("Terminating unresponsive WebSocket client");
        client.socket.terminate();
        clients.delete(client);
        return;
      }

      client.isAlive = false;
      client.socket.ping();
    });
  }, HEARTBEAT_INTERVAL_MS);

  wss.on("close", () => clearInterval(heartbeatInterval));
};

export const broadcastECG = (patientId: string, sample: any) => {
  const payload = JSON.stringify({
    type: "ECG_SAMPLE",
    data: sample,
  });

  clients.forEach((client) => {
    if (client.patientId !== patientId) return;
    if (client.socket.readyState !== WebSocket.OPEN) return;

    if (client.socket.bufferedAmount > MAX_BUFFERED_BYTES) {
      logger.warn("Dropping ECG sample for slow client", {
        patientId,
        bufferedAmount: client.socket.bufferedAmount,
      });
      return;
    }

    try {
      client.socket.send(payload);
    } catch (err) {
      logger.error("Failed to send ECG sample", err);
    }
  });
};
