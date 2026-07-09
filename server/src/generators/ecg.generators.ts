interface PatientECGState {
  phase: number;
  heartRate: number;
  amplitude: number;
  noise: number;
}

const patientStates = new Map<string, PatientECGState>();

function getState(patientId: string, heartRate: number) {
  let state = patientStates.get(patientId);

  if (!state) {
    state = {
      phase: Math.random() * Math.PI * 2,
      heartRate,
      amplitude: 0.9 + Math.random() * 0.2,
      noise: 0.005 + Math.random() * 0.01,
    };

    patientStates.set(patientId, state);
  }

  return state;
}

export function generateECGPoint(patientId: string, heartRate: number) {
  const state = getState(patientId, heartRate);

  state.phase += (heartRate / 60) * 0.08;

  const x = state.phase % (Math.PI * 2);

  const baseline = Math.sin(x) * 0.01 + (Math.random() - 0.5) * state.noise;

  const p = 0.15 * Math.exp(-Math.pow((x - 1.0) / 0.12, 2));

  const q = -0.2 * Math.exp(-Math.pow((x - 2.0) / 0.03, 2));

  const r = state.amplitude * Math.exp(-Math.pow((x - 2.08) / 0.02, 2));

  const s = -0.35 * Math.exp(-Math.pow((x - 2.15) / 0.03, 2));

  const t = 0.35 * Math.exp(-Math.pow((x - 3.1) / 0.22, 2));

  return {
    timestamp: new Date(),
    lead: 1,
    value: baseline + p + q + r + s + t,
  };
}
