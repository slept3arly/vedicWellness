import { prisma } from "@/lib/db/prisma";
import { unstable_cache } from "next/cache";
import { PlacementKey, Prisma } from "@prisma/client";

/* ===============================
   TYPES
================================ */

export type PublicSlide = {
  id: string;
  imageDesktopUrl: string;
  imageMobileUrl: string;
};

/* ===============================
   QUERY SHAPE (CRITICAL FIX)
================================ */

const slidePlacementQuery =
  Prisma.validator<Prisma.SlidePlacementFindManyArgs>()({
    where: {
      placementKey: undefined as unknown as PlacementKey, // overridden at runtime
      isActive: true,
    },
    orderBy: { order: "asc" },
    include: {
      slide: {
        select: {
          id: true,
          imageDesktopUrl: true,
          imageMobileUrl: true,
        },
      },
    },
  });

/* ===============================
   INTERNAL CACHED FETCH
================================ */

function getCachedSlidesInternal(placementKey: PlacementKey) {
  return unstable_cache(
    async (): Promise<PublicSlide[]> => {
      const now = new Date();

      const placements = await prisma.slidePlacement.findMany({
        ...slidePlacementQuery,
        where: {
          placementKey,
          isActive: true,
          AND: [
            { OR: [{ startAt: null }, { startAt: { lte: now } }] },
            { OR: [{ endAt: null }, { endAt: { gte: now } }] },
          ],
        },
      });

      return placements.map((p) => p.slide);
    },
    [`slides-${placementKey}`],
    {
      tags: ["slides"],
      revalidate: false,
    }
  )();
}

/* ===============================
   PUBLIC API
================================ */

export async function getPublicSlides(
  placementKey: PlacementKey
) {
  return getCachedSlidesInternal(placementKey);
}