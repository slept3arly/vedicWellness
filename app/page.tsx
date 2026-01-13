import Hero from "@/components/home/Hero";
import TrustRow from "@/components/home/TrustRow";
import StatsStrip from "@/components/home/StatsStrip";
import ProductCategories from "@/components/home/ProductCategories";
import FranchiseBenefits from "@/components/home/FranchiseBenefits";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TrustRow />
      <StatsStrip />
      <ProductCategories />
      <FranchiseBenefits />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </div>
  );
}
