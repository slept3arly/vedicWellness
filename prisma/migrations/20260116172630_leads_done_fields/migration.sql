/*
  Warnings:

  - You are about to drop the column `done` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `doneAt` on the `AuditLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "done",
DROP COLUMN "doneAt";
