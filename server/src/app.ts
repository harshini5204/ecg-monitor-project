import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import patientRoutes from "./routes/patient.routes";
import ecgRoutes from "./routes/ecg.routes";
import { CORS_ORIGINS } from "./config/env";

const app = express();

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * Enable CORS — allow any of the configured dev/prod origins
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || CORS_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
  }),
);

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
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

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
