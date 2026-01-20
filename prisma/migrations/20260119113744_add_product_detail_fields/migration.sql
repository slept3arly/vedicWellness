-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brochureUrl" TEXT,
ADD COLUMN     "contraindications" JSONB,
ADD COLUMN     "directionsToUse" TEXT,
ADD COLUMN     "indications" JSONB,
ADD COLUMN     "ingredients" JSONB,
ADD COLUMN     "packSizes" JSONB;

-- CreateIndex
CREATE INDEX "Product_published_idx" ON "Product"("published");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");
