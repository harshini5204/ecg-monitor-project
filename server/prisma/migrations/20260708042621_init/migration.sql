-- AlterTable
ALTER TABLE "public"."ecg_samples" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."ecg_sessions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."patients" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "patients_deviceId_idx" ON "public"."patients"("deviceId");
