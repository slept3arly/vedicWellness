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
    <Section>
      <MediaSlider slides={slides} />
    </Section>
  );
}