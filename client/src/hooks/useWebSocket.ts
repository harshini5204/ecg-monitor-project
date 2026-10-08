import { useEffect, useRef } from "react";
import type { ECGPoint } from "../types/ecg";

interface UseWebSocketProps {
  patientId: string;
  onMessage: (sample: ECGPoint) => void;
}

export function useWebSocket({ patientId, onMessage }: UseWebSocketProps) {
  const socketRef = useRef<WebSocket | null>(null);

  const callbackRef = useRef(onMessage);

  useEffect(() => {
    callbackRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!patientId) return;

    const socket = new WebSocket("ws://localhost:4000");

    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "SUBSCRIBE",
          patientId,
        }),
      );
    };

    socket.onmessage = (event) => {
      let message: unknown;

      try {
        message = JSON.parse(event.data);
      } catch (error) {
        console.error("Failed to parse WebSocket message", error);
        return;
      }

      if (
        typeof message === "object" &&
        message !== null &&
        "type" in message &&
        message.type === "ECG_SAMPLE" &&
        "data" in message
      ) {
        callbackRef.current(message.data as ECGPoint);
      }
    };

    return () => socket.close();
  }, [patientId]);
}
