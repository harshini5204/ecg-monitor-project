import { useEffect, useRef } from "react";

interface UseWebSocketProps {
  patientId: string;
  onMessage: (sample: any) => void;
}

export function useWebSocket({ patientId, onMessage }: UseWebSocketProps) {
  const socketRef = useRef<WebSocket | null>(null);

  const callbackRef = useRef(onMessage);

  callbackRef.current = onMessage;

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
      const message = JSON.parse(event.data);

      if (message.type === "ECG_SAMPLE") {
        callbackRef.current(message.data);
      }
    };

    return () => socket.close();
  }, [patientId]);
}
