import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";

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

    socket.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "SUBSCRIBE") {
          client.patientId = data.patientId;
        }
      } catch (err) {}
    });

    socket.on("close", () => {
      clients.delete(client);
    });
  });
};

export const broadcastECG = (patientId: string, sample: any) => {
  clients.forEach((client) => {
    if (client.patientId === patientId) {
      client.socket.send(
        JSON.stringify({
          type: "ECG_SAMPLE",
          data: sample,
        }),
      );
    }
  });
};
