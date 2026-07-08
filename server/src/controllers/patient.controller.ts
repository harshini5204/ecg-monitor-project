import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// get patients
export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const { patientId, name, age, gender, dateOfBirth, deviceId, roomNumber } =
      req.body;

    const patient = await prisma.patient.create({
      data: {
        patientId,
        name,
        age,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        deviceId,
        roomNumber,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create patient",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const patient = await prisma.patient.findUnique({
      where: {
        id,
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const { name, age, gender, roomNumber, status, deviceId } = req.body;

    const patient = await prisma.patient.update({
      where: {
        id,
      },
      data: {
        name,
        age,
        gender,
        roomNumber,
        status,
        deviceId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update patient",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.patient.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete patient",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
