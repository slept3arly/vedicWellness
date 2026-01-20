/*
  Warnings:

  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "tag" TEXT,
ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "published" SET DEFAULT false;
