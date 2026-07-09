import { useCallback, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import type { ECGPoint } from "../types/ecg";

export function useECG(patientId: string) {
  const MAX_POINTS = 250;

  const [points, setPoints] = useState(
    Array(MAX_POINTS).fill({
      value: null,
      timestamp: 0,
    }),
  );
  const handleMessage = useCallback((sample: ECGPoint) => {
    console.log("Adding sample:", sample);

    setPoints((prev) => {
      const next = [...prev];

      next.shift(); // Remove the oldest point
      next.push(sample); // Add the newest point

      return next;
    });
  }, []);

  useWebSocket({
    patientId,
    onMessage: handleMessage,
  });

  return points;
}
