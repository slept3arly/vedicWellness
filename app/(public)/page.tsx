import Hero from "@/components/public/sections/Hero";
import TrustStrip from "@/components/public/sections/TrustStrip";
import StatsSection from "@/components/public/sections/StatsFloating";
import Categories from "@/components/public/sections/Categories";
import Philosophy from "@/components/public/sections/Philosophy";
import HowItWorks from "@/components/public/sections/HowItWorks";
import MediaShowcase from "@/components/public/sections/MediaShowcase";
import FranchiseBenefits from "@/components/public/sections/FranchiseBenefits";
import Testimonials from "@/components/public/sections/Testimonials";
import CTABanner from "@/components/public/sections/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />

      <TrustStrip />

      <StatsSection />

      {/* Early visual proof */}
      <MediaShowcase placementKey="HOME_HERO" />

      <Categories />

      <HowItWorks />

      <Philosophy />

      {/* Reinforcement before conversion */}
      <MediaShowcase placementKey="HOME_SECONDARY" />


      <FranchiseBenefits />

      <Testimonials />

      <CTABanner />
    </>
  );
}
