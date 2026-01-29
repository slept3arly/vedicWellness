/*
  Warnings:

  - You are about to drop the column `done` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `doneAt` on the `Lead` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CONVERTED', 'LOST');

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "done",
DROP COLUMN "doneAt",
ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "status" "LeadStatus" NOT NULL DEFAULT 'NEW';

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
