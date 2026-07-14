/*
  Warnings:

  - The primary key for the `ecg_sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ecg_sessions` table. All the data in the column will be lost.
  - Changed the type of `sessionId` on the `ecg_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."ecg_samples" DROP CONSTRAINT "ecg_samples_sessionId_fkey";

-- DropIndex
DROP INDEX "public"."ecg_sessions_sessionId_key";

-- AlterTable
ALTER TABLE "public"."ecg_sessions" DROP CONSTRAINT "ecg_sessions_pkey",
DROP COLUMN "id",
DROP COLUMN "sessionId",
ADD COLUMN     "sessionId" UUID NOT NULL,
ADD CONSTRAINT "ecg_sessions_pkey" PRIMARY KEY ("sessionId");

-- AddForeignKey
ALTER TABLE "public"."ecg_samples" ADD CONSTRAINT "ecg_samples_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ecg_sessions"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;
