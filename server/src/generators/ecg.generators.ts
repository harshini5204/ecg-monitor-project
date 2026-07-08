export interface ECGPoint {
  timestamp: Date;
  value: number;
  lead: number;
}

let time = 0;

function gaussian(x: number, center: number, width: number, amplitude: number) {
  return (
    amplitude * Math.exp(-Math.pow(x - center, 2) / (2 * Math.pow(width, 2)))
  );
}

export function generateECGPoint(heartRate = 72): ECGPoint {
  const beatDuration = 60000 / heartRate;

  time += 4;

  const phase = time % beatDuration;

  let value = 0;

  value += gaussian(phase, beatDuration * 0.2, 18, 0.15);

  value += gaussian(phase, beatDuration * 0.38, 5, -0.2);

  value += gaussian(phase, beatDuration * 0.4, 4, 1.2);

  value += gaussian(phase, beatDuration * 0.42, 5, -0.35);

  value += gaussian(phase, beatDuration * 0.65, 22, 0.35);

  value += Math.sin(time / 1500) * 0.02;

  value += (Math.random() - 0.5) * 0.01;

  return {
    timestamp: new Date(),
    value,
    lead: 1,
  };
}
