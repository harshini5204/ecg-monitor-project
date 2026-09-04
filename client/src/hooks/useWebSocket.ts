import { useEffect, useRef, useState } from "react";

interface UseWebSocketProps {
  patientId: string;
  onMessage: (sample: any) => void;
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
const WS_AUTH_TOKEN = import.meta.env.VITE_WS_AUTH_TOKEN || "";

const BASE_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 10000;

export function useWebSocket({ patientId, onMessage }: UseWebSocketProps) {
  const callbackRef = useRef(onMessage);

  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    callbackRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!patientId) return;

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempt = 0;
    let stopped = false;

    function connect() {
      setStatus("connecting");

      const url = WS_AUTH_TOKEN
        ? `${WS_URL}?token=${encodeURIComponent(WS_AUTH_TOKEN)}`
        : WS_URL;

      const current = new WebSocket(url);

      socket = current;

      current.onopen = () => {
        reconnectAttempt = 0;
        setStatus("connected");

        current.send(
          JSON.stringify({
            type: "SUBSCRIBE",
            patientId,
          }),
        );
      };

      current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "ECG_SAMPLE") {
            callbackRef.current(message.data);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message", err);
        }
      };

      current.onerror = () => {
        console.error("WebSocket error while streaming patient", patientId);
      };

      current.onclose = () => {
        setStatus("disconnected");

        if (stopped) return;

        const delay = Math.min(
          BASE_RECONNECT_DELAY_MS * 2 ** reconnectAttempt,
          MAX_RECONNECT_DELAY_MS,
        );

        reconnectAttempt += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      stopped = true;

      if (reconnectTimer) clearTimeout(reconnectTimer);

      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
      }
    };
  }, [patientId]);

  return status;
}
