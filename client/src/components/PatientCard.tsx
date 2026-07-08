import { useState } from "react";
import ECGChart from "./ECGChart";
import ECGToolbar from "./ECGToolbar";
import type { Patient } from "../types/patient";
import { useECG } from "../hooks/useECG";
import { useMonitoring } from "../hooks/useMonitoring";

interface PatientCardProps {
  patient: Patient;
}

function PatientCard({ patient }: PatientCardProps) {
  const data = useECG(patient.id);

  const { sessionId, start: startMonitoring, stop } = useMonitoring();

  const [speed, setSpeed] = useState<number>(100);

  const isRunning = Boolean(sessionId);

  const handleStart = () => startMonitoring(patient.id);
  const handlePause = () => stop();
  const handleReset = () => {};

  return (
    <div className="rounded-xl bg-slate-800 p-4 shadow-lg">
      <div className="mb-4 flex justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{patient.name}</h2>

          <p className="text-slate-300">Age : {patient.age}</p>

          <p className="text-green-400">{patient.heartRate} BPM</p>
        </div>

        <div>
          <span className="rounded bg-green-600 px-3 py-1 text-white">
            {patient.status}
          </span>
        </div>
      </div>

      <ECGToolbar
        isRunning={isRunning}
        speed={speed}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSpeedChange={setSpeed}
      />

      <ECGChart data={data} />
    </div>
  );
}

export default PatientCard;
