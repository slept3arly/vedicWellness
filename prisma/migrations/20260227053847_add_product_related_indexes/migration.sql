-- CreateIndex
CREATE INDEX "Product_published_tag_idx" ON "Product"("published", "tag");

-- CreateIndex
CREATE INDEX "Product_published_medicineForm_idx" ON "Product"("published", "medicineForm");

-- CreateIndex
CREATE INDEX "Product_published_createdAt_idx" ON "Product"("published", "createdAt");
