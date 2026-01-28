-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SALES', 'VIEWER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'VIEWER';
