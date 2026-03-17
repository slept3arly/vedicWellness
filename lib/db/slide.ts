import "server-only";
import { prisma } from "@/lib/db/prisma";

/* ===============================
   CREATE
================================ */
export async function createSlideDB(data: {
  imageDesktopUrl: string;
  imageMobileUrl: string;
}) {
  return prisma.slide.create({
    data,
    select: { id: true },
  });
}

/* ===============================
   CREATE PLACEMENT
================================ */
export async function createSlidePlacementDB(data: {
  slideId: string;
  placementKey: any;
  order: number;
  isActive: boolean;
  startAt: Date | null;
  endAt: Date | null;
}) {
  return prisma.slidePlacement.create({
    data,
  });
}

/* ===============================
   UPDATE
================================ */
export async function updateSlideDB(
  id: string,
  data: {
    imageDesktopUrl: string;
    imageMobileUrl: string;
  }
) {
  return prisma.slide.update({
    where: { id },
    data,
  });
}

/* ===============================
   UPDATE PLACEMENT
================================ */
export async function updateSlidePlacementDB(
  slideId: string,
  data: {
    placementKey: any;
    order: number;
    isActive: boolean;
    startAt: Date | null;
    endAt: Date | null;
  }
) {
  return prisma.slidePlacement.updateMany({
    where: { slideId },
    data,
  });
}

/* ===============================
   DELETE
================================ */
export async function deleteSlideDB(id: string) {
  return prisma.slide.delete({
    where: { id },
  });
}

/* ===============================
   ADMIN LIST (PAGINATED)
================================ */
export async function getAdminSlides(
  page = 1,
  limit = 20
) {
  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.slide.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        placements: true,
      },
    }),
    prisma.slide.count(),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}