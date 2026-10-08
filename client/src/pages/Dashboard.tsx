import { useState } from "react";
import PatientList from "../components/PatientList";
import ECGChart from "../components/ECGChart";

import { usePatients } from "../hooks/usePatients";
import { useMonitoring } from "../hooks/useMonitoring";

import type { Patient } from "../types/patient";
import { useECG } from "../hooks/useECG";

export default function Dashboard() {
  const { patients } = usePatients();

  const { start, stop, sessionId } = useMonitoring();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Live ECG data
  const ecgData = useECG(selectedPatient?.id ?? "");

  return (
    <div className="grid h-screen grid-cols-12">
      {/* Patient List */}
      <div className="col-span-3 border-r bg-slate-100 p-4">
        <h2 className="mb-4 text-xl font-bold">Patients</h2>

        <PatientList patients={patients} onSelect={setSelectedPatient} />
      </div>

      {/* Right Side */}
      <div className="col-span-9 bg-slate-900 p-6">
        {!selectedPatient ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            Select a patient to start monitoring
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-lg bg-slate-800 p-4 text-white">
              <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>

              <p>Room : {selectedPatient.roomNumber}</p>

              <p>Status : {sessionId ? "Monitoring" : "Stopped"}</p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => start(selectedPatient.id)}
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Start Monitoring
                </button>

                <button
                  onClick={stop}
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Stop Monitoring
                </button>
              </div>
            </div>

            <p className="text-white">Total ECG Points: {ecgData.length}</p>

            <div className="rounded-lg bg-slate-800 p-4">
              <ECGChart data={ecgData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
