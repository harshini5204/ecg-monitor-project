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
    console.log("Client Connected");

    const client: ClientInfo = {
      socket,
    };

    clients.add(client);

    socket.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "SUBSCRIBE") {
          client.patientId = data.patientId;

          console.log(`Subscribed to ${client.patientId}`);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("close", () => {
      clients.delete(client);
    });
  });
};

export const broadcastECG = (patientId: string, sample: any) => {
  console.log(`Broadcasting ECG for patient ${patientId}:`, sample);
  clients.forEach((client) => {
    console.log(`Checking client for patient ${client.patientId}`);
    if (client.patientId === patientId) {
      console.log(`Sending sample to patient ${patientId}:`, sample);
      client.socket.send(
        JSON.stringify({
          type: "ECG_SAMPLE",
          data: sample,
        }),
      );
    }
  });
};
