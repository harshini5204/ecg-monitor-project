import { useState } from "react";
import { startMonitoring, stopMonitoring } from "../api/ecg.api";

export function useMonitoring() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  async function start(patientId: string) {
    setLoading(true);

    try {
      const response = await startMonitoring(patientId);

      setSessionId(response.data.sessionId);

      return response.data;
    } finally {
      setLoading(false);
    }
  }

  async function stop() {
    if (!sessionId) return;

    await stopMonitoring(sessionId);

    setSessionId(null);
  }

  return {
    sessionId,
    loading,
    start,
    stop,
  };
}
