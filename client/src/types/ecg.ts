export interface ECGPoint {
  timestamp: string;
  value: number;
  lead: number;
  patientId: string;
  sessionId: string;
  heartRate?: number;
}

export interface PatientECG {
  patientId: string;
  points: ECGPoint[];
}
