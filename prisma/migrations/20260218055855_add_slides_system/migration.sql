-- CreateEnum
CREATE TYPE "PlacementKey" AS ENUM ('HOME_HERO', 'HOME_SECONDARY', 'BLOGS_TOP', 'CATEGORY_TOP', 'FESTIVAL_BANNER');

-- CreateTable
CREATE TABLE "Slide" (
    "id" TEXT NOT NULL,
    "imageDesktopUrl" TEXT NOT NULL,
    "imageMobileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlidePlacement" (
    "id" TEXT NOT NULL,
    "slideId" TEXT NOT NULL,
    "placementKey" "PlacementKey" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlidePlacement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SlidePlacement_placementKey_idx" ON "SlidePlacement"("placementKey");

-- CreateIndex
CREATE INDEX "SlidePlacement_startAt_endAt_idx" ON "SlidePlacement"("startAt", "endAt");

-- AddForeignKey
ALTER TABLE "SlidePlacement" ADD CONSTRAINT "SlidePlacement_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
