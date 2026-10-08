import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { logger } from "../utils/logger";

interface ClientInfo {
  socket: WebSocket;
  patientId?: string;
}

const clients = new Set<ClientInfo>();

let wss: WebSocketServer;

export const initializeWebSocket = (server: any) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
    const client: ClientInfo = {
      socket,
    };

    clients.add(client);
    logger.info("WebSocket client connected", { totalClients: clients.size });

    socket.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "SUBSCRIBE") {
          client.patientId = data.patientId;

          logger.info("WebSocket client subscribed", {
            patientId: client.patientId,
          });
        }
      } catch (error) {
        logger.warn(
          "Failed to parse WebSocket message",
          error instanceof Error ? error : String(error),
        );
      }
    });

    socket.on("close", () => {
      clients.delete(client);
      logger.info("WebSocket client disconnected", {
        totalClients: clients.size,
      });
    });
  });
};

export const broadcastECG = (patientId: string, sample: any) => {
  clients.forEach((client) => {
    if (
      client.patientId === patientId &&
      client.socket.readyState === WebSocket.OPEN
    ) {
      client.socket.send(
        JSON.stringify({
          type: "ECG_SAMPLE",
          data: sample,
        }),
      );
    }
  });
};
