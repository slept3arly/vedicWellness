import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import StatsSection from "@/components/sections/StatsFloating";
import Categories from "@/components/sections/Categories";
import Philosophy from "@/components/sections/Philosophy";
import HowItWorks from "@/components/sections/HowItWorks";
import MediaShowcase from "@/components/sections/MediaShowcase";
import FranchiseBenefits from "@/components/sections/FranchiseBenefits";
import Testimonials from "@/components/sections/Testimonials";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <StatsSection />
      <Categories />
      <Philosophy />
      <HowItWorks />
      <MediaShowcase />
      <FranchiseBenefits />
      <Testimonials />
      <CTABanner />
    </>
  );
}
