import { useMemo } from "react";
import type { ECGPoint } from "../types/ecg";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

interface ECGChartProps {
  data: ECGPoint[];
}

function ECGChart({ data }: ECGChartProps) {
  const chartData = useMemo(() => {
    return {
      labels: data.map((_, index) => index),
      datasets: [
        {
          label: "ECG",
          data: data.map((point) => point.value),
          borderColor: "#22c55e",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },

      y: {
        min: -1.2,
        max: 1.2,
      },
    },
  };

  return (
    <div className="h-full">
      <Line data={chartData} options={options as ChartOptions<"line">} />
    </div>
  );
}

export default ECGChart;
