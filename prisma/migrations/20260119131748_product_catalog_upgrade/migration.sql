/*
  Warnings:

  - You are about to drop the column `brochureUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `packSizes` on the `Product` table. All the data in the column will be lost.
  - The `directionsToUse` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DosageFormCategory" AS ENUM ('SOLID', 'LIQUID', 'TOPICAL', 'POWDER', 'SPRAY', 'SUPPOSITORY', 'OTHER');

-- CreateEnum
CREATE TYPE "CostUnit" AS ENUM ('PER_PACK', 'PER_STRIP', 'PER_BOTTLE', 'PER_TUBE', 'PER_CAPSULE', 'PER_TABLET', 'PER_ML', 'PER_GM');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "brochureUrl",
DROP COLUMN "packSizes",
ADD COLUMN     "cost" INTEGER,
ADD COLUMN     "costUnit" "CostUnit",
ADD COLUMN     "dosageFormCategory" "DosageFormCategory",
ADD COLUMN     "dosageFormSubcategory" TEXT,
ADD COLUMN     "measurePerUnit" INTEGER,
ADD COLUMN     "measureUnit" TEXT,
ADD COLUMN     "packCount" INTEGER,
ADD COLUMN     "packUnit" TEXT,
ADD COLUMN     "shortDescription" TEXT,
DROP COLUMN "directionsToUse",
ADD COLUMN     "directionsToUse" JSONB;

-- CreateIndex
CREATE INDEX "Product_published_idx" ON "Product"("published");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");
