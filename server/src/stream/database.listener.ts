import { prisma } from "../config/prisma";
import { subscribeECG } from "./ecg.stream";

export function initializeDatabaseListener() {
  subscribeECG(async (sample) => {
    await prisma.ecgSample.create({
      data: sample,
    });
  });
}
