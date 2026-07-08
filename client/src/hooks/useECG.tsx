import { useCallback, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import type { ECGPoint } from "../types/ecg";

export function useECG(patientId: string) {
  const [points, setPoints] = useState<ECGPoint[]>([]);

  const handleMessage = useCallback((sample: ECGPoint) => {
    console.log("Adding sample:", sample);

    setPoints((prev) => {
      const next = [...prev, sample];
      console.log("New length:", next.length);
      return next;
    });
  }, []);

  useWebSocket({
    patientId,
    onMessage: handleMessage,
  });

  return points;
}
