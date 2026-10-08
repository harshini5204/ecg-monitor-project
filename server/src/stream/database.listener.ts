import { prisma } from "../config/prisma";
import { subscribeECG } from "./ecg.stream";

export function initializeDatabaseListener() {
  subscribeECG(async (_patientId, sample) => {
    await prisma.ecgSample.create({
      data: sample,
    });
  });
}
