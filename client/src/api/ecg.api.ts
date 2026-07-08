const BASE_URL = "http://localhost:4000/api";

export async function startMonitoring(patientId: string) {
  const response = await fetch(`${BASE_URL}/ecg/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientId,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to start monitoring");
  }

  return response.json();
}

export async function stopMonitoring(sessionId: string) {
  const response = await fetch(`${BASE_URL}/ecg/stop`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to stop monitoring");
  }

  return response.json();
}
