CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");
CREATE INDEX "Company_active_idx" ON "Company"("active");

ALTER TABLE "Product" ADD COLUMN "companyId" TEXT;

INSERT INTO "Company" ("id", "name", "slug", "active", "updatedAt")
VALUES ('vedic-wellness-company', 'Vedic Wellness', 'vedic-wellness', true, CURRENT_TIMESTAMP);

UPDATE "Product" SET "companyId" = 'vedic-wellness-company' WHERE "companyId" IS NULL;
ALTER TABLE "Product" ALTER COLUMN "companyId" SET NOT NULL;
CREATE INDEX "Product_companyId_published_idx" ON "Product"("companyId", "published");
ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
