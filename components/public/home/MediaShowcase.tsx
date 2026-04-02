import Section from "@/components/public/ui/Section";
import MediaSlider from "@/components/public/ui/MediaSlider";

import { getPublicSlides } from "@/lib/services/public/slideService";
import { PlacementKey } from "@prisma/client";

type Props = {
  placementKey: PlacementKey;
};

export default async function MediaShowcase({
  placementKey,
}: Props) {
  const slides = await getPublicSlides(placementKey);

  if (!slides.length) return null;

  return (
    <Section className="w-full py-8 md:py-12">
      <MediaSlider slides={slides} />
    </Section>
  );
}