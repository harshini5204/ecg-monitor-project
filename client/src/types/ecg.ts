export interface ECGPoint {
  timestamp: string;
  value: number;
  lead: number;
  patientId: string;
  sessionId: string;
}

export interface PatientECG {
  patientId: string;
  points: ECGPoint[];
}
