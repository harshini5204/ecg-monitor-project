import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { startECGMonitoring, stopECGMonitoring } from "../timers/ecg.timers";

export const startMonitoring = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "patientId is required",
      });
    }

    // Check patient exists
    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check if there is already an active session
    const activeSession = await prisma.ecgSession.findFirst({
      where: {
        patientId,
        status: "ACTIVE",
      },
    });

    if (activeSession) {
      return res.status(409).json({
        success: false,
        message: "Patient already has an active ECG session",
      });
    }

    // Create new session
    const session = await prisma.ecgSession.create({
      data: {
        patientId,
        status: "ACTIVE",
      },
    });

    // Start ECG generation
    startECGMonitoring(patient.id, session.sessionId);

    return res.status(201).json({
      success: true,
      message: "ECG Monitoring Started",
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to start ECG monitoring",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const stopMonitoring = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    const session = await prisma.ecgSession.findUnique({
      where: {
        sessionId: sessionId as string,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const stopped = await stopECGMonitoring(sessionId);

    if (!stopped) {
      return res.status(400).json({
        success: false,
        message: "Session is already stopped",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Monitoring stopped successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to stop monitoring",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getActiveSession = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;

    const session = await prisma.ecgSession.findFirst({
      where: {
        patientId: patientId as string,
        status: "ACTIVE",
      },
      include: {
        patient: {
          select: {
            id: true,
            patientId: true,
            name: true,
            roomNumber: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active session found",
      });
    }

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active session",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getECGHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const samples = await prisma.ecgSample.findMany({
      where: {
        sessionId: sessionId as string,
      },
      orderBy: {
        timestamp: "asc",
      },
      take: 5000,
    });

    return res.status(200).json({
      success: true,
      count: samples.length,
      data: samples,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ECG history",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
