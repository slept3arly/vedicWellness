-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "doneAt" TIMESTAMP(3);
