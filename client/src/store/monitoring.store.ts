import { create } from "zustand";

interface MonitoringStore {
  patientId: string | null;
  sessionId: string | null;

  setPatient(id: string): void;

  setSession(id: string): void;
}

export const useMonitoringStore = create<MonitoringStore>((set) => ({
  patientId: null,

  sessionId: null,

  setPatient: (id) =>
    set({
      patientId: id,
    }),

  setSession: (id) =>
    set({
      sessionId: id,
    }),
}));
