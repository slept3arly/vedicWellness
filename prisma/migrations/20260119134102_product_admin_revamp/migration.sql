/*
  Warnings:

  - You are about to drop the column `cost` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `costUnit` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `dosageFormCategory` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `dosageFormSubcategory` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `measurePerUnit` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `measureUnit` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `packCount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `packUnit` on the `Product` table. All the data in the column will be lost.
  - Made the column `price` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MedicineForm" AS ENUM ('TABLET', 'CAPSULE', 'SYRUP', 'DROPS', 'SUSPENSION', 'POWDER', 'GRANULES', 'OINTMENT', 'CREAM', 'GEL', 'LOTION', 'SHAMPOO', 'OIL', 'SPRAY', 'INHALER', 'INJECTION', 'OTHER');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "cost",
DROP COLUMN "costUnit",
DROP COLUMN "description",
DROP COLUMN "dosageFormCategory",
DROP COLUMN "dosageFormSubcategory",
DROP COLUMN "measurePerUnit",
DROP COLUMN "measureUnit",
DROP COLUMN "packCount",
DROP COLUMN "packUnit",
ADD COLUMN     "medicineForm" "MedicineForm",
ADD COLUMN     "packaging" JSONB,
ALTER COLUMN "price" SET NOT NULL;

-- DropEnum
DROP TYPE "CostUnit";

-- DropEnum
DROP TYPE "DosageFormCategory";
