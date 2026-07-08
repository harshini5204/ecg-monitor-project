import { Router } from "express";
import {
  getActiveSession,
  getECGHistory,
  startMonitoring,
  stopMonitoring,
} from "../controllers/ecg.controllers";

const router = Router();

router.post("/start", startMonitoring);
router.post("/stop", stopMonitoring);
router.get("/session/:patientId", getActiveSession);
router.get("/history/:patientId", getECGHistory);

export default router;
