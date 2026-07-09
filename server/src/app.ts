import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
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
// cache-no-store, no-cache, must-revalidate, proxy-revalidate
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});
/**
 * Request Logger
 */
app.use(morgan("dev"));

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
