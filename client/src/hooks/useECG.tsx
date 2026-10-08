import { useCallback, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import type { ECGPoint } from "../types/ecg";

export function useECG(patientId: string) {
  const [points, setPoints] = useState<ECGPoint[]>([]);

  const handleMessage = useCallback((sample: ECGPoint) => {
    setPoints((prev) => {
      return [...prev, sample];
    });
  }, []);

  useWebSocket({
    patientId,
    onMessage: handleMessage,
  });

  return points;
}
