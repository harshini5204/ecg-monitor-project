import { prisma } from "../config/prisma";
import { generateECGPoint } from "../generators/ecg.generators";
import { broadcastECG } from "../websockets/websockets.server";
import { logger } from "../utils/logger";

const activeSessions = new Map<string, NodeJS.Timeout>();

export const startECGMonitoring = (
  patientId: string,
  sessionId: string,
  heartRate: number = 72,
) => {
  // Prevent duplicate timers
  if (activeSessions.has(sessionId)) {
    return;
  }

  const interval = setInterval(async () => {
    try {
      const point = generateECGPoint(heartRate);

      await prisma.ecgSample.create({
        data: {
          id: crypto.randomUUID(),
          sessionId,
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
      });

    } catch (error) {
      logger.error("ECG sample processing failed", {
        sessionId,
        patientId,
        error,
      });
    }
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
      sessionId,
    },
    data: {
      status: "COMPLETED",
      endedAt: new Date(),
    },
  });

  return true;
};
