type ECGListener = (patientId: string, sample: any) => void;

const listeners = new Set<ECGListener>();

export const subscribeECG = (listener: ECGListener) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

export const publishECG = (patientId: string, sample: any) => {
  listeners.forEach((listener) => {
    listener(patientId, sample);
  });
};
