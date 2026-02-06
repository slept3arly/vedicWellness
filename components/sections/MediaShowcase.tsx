import Section from "../ui/Section";
import MediaSlider from "../ui/MediaSlider";

export default function MediaShowcase() {
  return (
    <Section>
      <MediaSlider images={["/promo1.jpg", "/promo2.jpg", "/promo3.jpg"]} />
    </Section>
  );
}
