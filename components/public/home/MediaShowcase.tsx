import Section from "@/components/public/ui/Section";
import MediaSlider from "@/components/public/ui/MediaSlider";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

type Props = {
  placementKey:
    | "HOME_HERO"
    | "HOME_SECONDARY"
    | "BLOGS_TOP"
    | "CATEGORY_TOP"
    | "FESTIVAL_BANNER";
};

const getCachedSlides = (placementKey: Props["placementKey"]) =>
  unstable_cache(
    async () => {
      const now = new Date();

      const queryOptions = {
        where: {
          placementKey,
          isActive: true,
          AND: [
            { OR: [{ startAt: null }, { startAt: { lte: now } }] },
            { OR: [{ endAt: null }, { endAt: { gte: now } }] },
          ],
        },
        orderBy: { order: "asc" },
        include: { slide: true },
      } satisfies Prisma.SlidePlacementFindManyArgs;

      const placements = await prisma.slidePlacement.findMany(queryOptions);

      return placements.map((p) => p.slide);
    },
    [`slides-${placementKey}`],
    {
      revalidate: 86400,
      tags: ["slides"],
    }
  )();

export default async function MediaShowcase({ placementKey }: Props) {
  const slides = await getCachedSlides(placementKey);

  if (!slides.length) return null;

  return (
    <Section>
      <MediaSlider slides={slides} />
    </Section>
  );
}