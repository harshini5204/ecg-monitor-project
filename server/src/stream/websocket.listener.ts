import { broadcastECG } from "../websockets/websockets.server";
import { subscribeECG } from "./ecg.stream";

export function initializeWebSocketListener() {
  subscribeECG((patientId, sample) => {
    broadcastECG(patientId, sample);
  });
}
