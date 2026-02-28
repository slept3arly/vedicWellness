import Section from "@/components/public/ui/Section";
import MediaSlider from "@/components/public/ui/MediaSlider";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client"; // 1. Add this import
type Props = {
  placementKey:
    | "HOME_HERO"
    | "HOME_SECONDARY"
    | "BLOGS_TOP"
    | "CATEGORY_TOP"
    | "FESTIVAL_BANNER";
};

export default async function MediaShowcase({ placementKey }: Props) {
  const now = new Date();

  // 2. Use 'as const' or a Validator to get the type
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

  // Now 'p.slide' will be recognized!
  const slides = placements.map((p) => p.slide);

  if (!slides.length) return null;

  return (
    <Section>
      <MediaSlider slides={slides} />
    </Section>
  );
}