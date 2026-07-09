import { useMonitoring } from "../hooks/useMonitoring";
import { useECG } from "../hooks/useECG";
import ECGChart from "./ECGChart";

import type { Patient } from "../types/patient";

interface Props {
  patient: Patient;
}

export default function PatientCard({ patient }: Props) {
  const { start, stop, sessionId } = useMonitoring();

  const ecg = useECG(patient.id);

  return (
    <div className="rounded-xl bg-slate-800 p-5 shadow-lg">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{patient.name}</h2>

          <p className="text-gray-300">Age : {patient.age}</p>

          <p className="text-2xl text-green-400">72 BPM</p>
        </div>

        <span className="rounded bg-green-600 px-4 py-2 text-white">
          Connected
        </span>
      </div>

      <div className="mb-4 flex gap-3">
        <button
          onClick={() => start(patient.id)}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Start
        </button>

        <button
          onClick={stop}
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          Stop
        </button>
      </div>

      <div className="h-72">
        <ECGChart data={ecg} />
      </div>
    </div>
  );
}
