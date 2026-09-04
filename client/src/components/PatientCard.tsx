import { useMonitoring } from "../hooks/useMonitoring";
import { useECG } from "../hooks/useECG";
import ECGChart from "./ECGChart";

import type { Patient } from "../types/patient";

interface Props {
  patient: Patient;
}

const STATUS_LABEL: Record<string, string> = {
  connected: "Connected",
  connecting: "Connecting...",
  disconnected: "Disconnected",
};

const STATUS_CLASS: Record<string, string> = {
  connected: "bg-green-600",
  connecting: "bg-yellow-600",
  disconnected: "bg-red-600",
};

export default function PatientCard({ patient }: Props) {
  const { start, stop } = useMonitoring();

  const { points, heartRate, status } = useECG(patient.id);

  return (
    <div className="rounded-xl bg-slate-800 p-5 shadow-lg">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{patient.name}</h2>

          <p className="text-gray-300">Age : {patient.age}</p>

          <p className="text-2xl text-green-400">
            {heartRate !== null ? `${heartRate} BPM` : "-- BPM"}
          </p>
        </div>

        <span
          className={`rounded px-4 py-2 text-white ${STATUS_CLASS[status]}`}
        >
          {STATUS_LABEL[status]}
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
        <ECGChart data={points} />
      </div>
    </div>
  );
}
