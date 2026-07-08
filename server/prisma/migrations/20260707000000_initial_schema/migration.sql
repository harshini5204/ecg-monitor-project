CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');
CREATE TYPE "PatientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISCHARGED', 'TRANSFERRED');
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'STOPPED', 'FAILED');

CREATE TABLE "patients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMPTZ(3) NOT NULL,
    "deviceId" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "status" "PatientStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ecg_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "patientId" UUID NOT NULL,
    "sessionId" TEXT NOT NULL,
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMPTZ(3),
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ecg_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ecg_samples" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionId" UUID NOT NULL,
    "timestamp" TIMESTAMPTZ(3) NOT NULL,
    "lead" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ecg_samples_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "patients_patientId_key" ON "patients"("patientId");
CREATE UNIQUE INDEX "patients_deviceId_key" ON "patients"("deviceId");
CREATE INDEX "patients_status_idx" ON "patients"("status");
CREATE INDEX "patients_roomNumber_idx" ON "patients"("roomNumber");

CREATE UNIQUE INDEX "ecg_sessions_sessionId_key" ON "ecg_sessions"("sessionId");
CREATE INDEX "ecg_sessions_patientId_status_idx" ON "ecg_sessions"("patientId", "status");
CREATE INDEX "ecg_sessions_startedAt_idx" ON "ecg_sessions"("startedAt");

CREATE INDEX "ecg_samples_sessionId_timestamp_idx" ON "ecg_samples"("sessionId", "timestamp");
CREATE INDEX "ecg_samples_sessionId_lead_idx" ON "ecg_samples"("sessionId", "lead");

ALTER TABLE "ecg_sessions"
ADD CONSTRAINT "ecg_sessions_patientId_fkey"
FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ecg_samples"
ADD CONSTRAINT "ecg_samples_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "ecg_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;