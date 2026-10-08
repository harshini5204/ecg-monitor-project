import express from "express";
import cors from "cors";
import helmet from "helmet";
import patientRoutes from "./routes/patient.routes";
import ecgRoutes from "./routes/ecg.routes";

const app = express();

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * Enable CORS
 */
app.use(cors());

/**
 * Parse JSON Body
 */
app.use(express.json());

/**
 * Parse URL Encoded Data
 */
app.use(express.urlencoded({ extended: true }));

app.use("/api/patients", patientRoutes);
app.use("/api/ecg", ecgRoutes);
/**
 * Health Check
 */
app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "ECG Monitoring Backend Running",
  });
});

export default app;
