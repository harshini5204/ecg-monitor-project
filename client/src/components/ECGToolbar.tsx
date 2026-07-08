import { memo } from "react";

interface ECGToolbarProps {
  isRunning: boolean;
  speed: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

function ECGToolbar({
  isRunning,
  speed,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
}: ECGToolbarProps) {
  return (
    <div className="mb-6 flex items-center gap-4 rounded-lg bg-slate-800 p-4">
      <button
        onClick={isRunning ? onPause : onStart}
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        {isRunning ? "Pause" : "Start"}
      </button>

      <button
        onClick={onReset}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Reset
      </button>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-white">Speed</span>

        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="rounded bg-slate-700 px-3 py-2 text-white"
        >
          <option value={100}>1x</option>
          <option value={20}>2x</option>
          <option value={10}>4x</option>
        </select>
      </div>
    </div>
  );
}

export default memo(ECGToolbar);
