import "server-only";
import { prisma } from "@/lib/db/prisma";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { PlacementKey, Prisma } from "@prisma/client";

/* ===============================
   EXPORTED TYPES
================================ */

export type SlideListItem = Prisma.SlideGetPayload<{
  select: {
    id: true;
    imageDesktopUrl: true;
    imageMobileUrl: true;
    createdAt: true;
    placements: {
      select: {
        id: true;
        placementKey: true;
        order: true;
        isActive: true;
        startAt: true;
        endAt: true;
      };
    };
  };
}>;

/* ===============================
   TYPES
================================ */

export type SlidePlacementInput = {
  placementKey: PlacementKey;
  order: number;
  isActive: boolean;
  startAt: Date | null;
  endAt: Date | null;
};

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
  placementKey: PlacementKey;
  order: number;
  isActive: boolean;
  startAt: Date | null;
  endAt: Date | null;
}) {
  return prisma.slidePlacement.create({
    data,
    select: { id: true },
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
    select: { id: true },
  });
}

/* ===============================
   REPLACE PLACEMENTS
================================ */

export async function replaceSlidePlacementsDB(
  slideId: string,
  placements: SlidePlacementInput[]
) {
  await prisma.$transaction([
    prisma.slidePlacement.deleteMany({
      where: { slideId },
    }),
    prisma.slidePlacement.createMany({
      data: placements.map((p) => ({
        slideId,
        placementKey: p.placementKey,
        order: p.order,
        isActive: p.isActive,
        startAt: p.startAt,
        endAt: p.endAt,
      })),
    }),
  ]);
}

/* ===============================
   DELETE
================================ */

export async function deleteSlideDB(id: string) {
  return prisma.slide.delete({
    where: { id },
    select: { id: true },
  });
}

/* ===============================
   GET BY ID (FOR AUDIT + EDIT)
================================ */

export async function getSlideById(id: string) {
  return prisma.slide.findUnique({
    where: { id },
    select: {
      id: true,
      imageDesktopUrl: true,
      imageMobileUrl: true,
      placements: {
        select: {
          id: true,
          placementKey: true,
          order: true,
          isActive: true,
          startAt: true,
          endAt: true,
        },
      },
    },
  });
}

/* ===============================
   ADMIN LIST (PAGINATED)
================================ */

export async function getAdminSlides(
  page = 1,
  limit = ADMIN_PAGE_SIZE,
  q = ""
) {
  const skip = (page - 1) * limit;

  const where = q && Object.values(PlacementKey).includes(q as PlacementKey)
    ? { placements: { some: { placementKey: q as PlacementKey } } }
    : {};

  const [data, total] = await Promise.all([
    prisma.slide.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        imageDesktopUrl: true,
        imageMobileUrl: true,
        createdAt: true,
        placements: {
          select: {
            id: true,
            placementKey: true,
            order: true,
            isActive: true,
            startAt: true,
            endAt: true,
          },
        },
      },
    }),
    prisma.slide.count({ where }),
  ]);

  return {
    data: data as unknown as SlideListItem[],
    total,
    page,
    limit,
  };
}

/* ===============================
   ADMIN READ SINGLE SLIDE
================================ */

export async function getAdminSlideById(id: string) {
  return prisma.slide.findUnique({
    where: { id },
    include: {
      placements: true,
    },
  });
}