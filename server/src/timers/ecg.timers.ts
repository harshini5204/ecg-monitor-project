import { prisma } from "../config/prisma";
import { generateECGPoint } from "../generators/ecg.generators";
import { broadcastECG } from "../websockets/websockets.server";

const activeSessions = new Map<string, NodeJS.Timeout>();
const patientHeartRates = new Map<string, number>();

function getHeartRate(patientId: string) {
  if (!patientHeartRates.has(patientId)) {
    // Generate a random BPM between 65 and 95
    patientHeartRates.set(patientId, 65 + Math.floor(Math.random() * 30));
  }

  return patientHeartRates.get(patientId)!;
}

export const startECGMonitoring = (patientId: string, sessionId: string) => {
  // Prevent duplicate timers
  if (activeSessions.has(sessionId)) {
    return;
  }

  const interval = setInterval(async () => {
    try {
      const bpm = getHeartRate(patientId);

      const point = generateECGPoint(patientId, bpm);

      const session = await prisma.ecgSession.findUnique({
        where: { sessionId },
      });

      await prisma.ecgSample.create({
        data: {
          sessionId: session?.sessionId as string,
          timestamp: point.timestamp,
          lead: point.lead,
          value: point.value,
        },
      });

      broadcastECG(patientId, {
        sessionId,
        patientId,
        timestamp: point.timestamp,
        lead: point.lead,
        value: point.value,
        heartRate: bpm,
      });
    } catch (error) {}
  }, 100);

  activeSessions.set(sessionId, interval);
};

export const stopECGMonitoring = async (sessionId: string) => {
  const timer = activeSessions.get(sessionId);

  if (!timer) {
    return false;
  }

  clearInterval(timer);

  activeSessions.delete(sessionId);

  await prisma.ecgSession.update({
    where: {
      sessionId: sessionId as string,
    },
    data: {
      status: "COMPLETED",
      endedAt: new Date(),
    },
  });

  return true;
};
