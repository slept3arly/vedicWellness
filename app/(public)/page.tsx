import Hero from "@/components/public/home/Hero";
import TrustStrip from "@/components/public/home/TrustStrip";
import StatsSection from "@/components/public/home/StatsFloating";
import Categories from "@/components/public/home/Categories";
import Philosophy from "@/components/public/home/Philosophy";
import HowItWorks from "@/components/public/home/HowItWorks";
import MediaShowcase from "@/components/public/home/MediaShowcase";
import FranchiseBenefits from "@/components/public/home/FranchiseBenefits";
import Testimonials from "@/components/public/home/Testimonials";
import CTABanner from "@/components/public/home/CTABanner";

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
