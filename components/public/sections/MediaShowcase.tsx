import Section from "@/components/public/Section";
import MediaSlider from "@/components/public/ui/MediaSlider";

export default function MediaShowcase() {
  return (
    <Section>
      <MediaSlider
        images={["/promo1.jpg", "/promo2.jpg", "/promo3.jpg"]}
      />
    </Section>
  );
}
