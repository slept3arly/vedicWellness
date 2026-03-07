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
      {/* 1. THE HOOK: Hero with clear 'Monopoly Rights' messaging */}
      <Hero />

      {/* 2. BRAND STORY: Build emotional trust with the Ayurvedic Philosophy */}
      <Philosophy />

      {/* 3. VISUAL PROOF: Show real warehouse, packaging, or office shots */}
      <MediaShowcase placementKey="HOME_HERO" />

      {/* 4. IMMEDIATE TRUST: Certificates (GMP/ISO) and TrustStrip */}
      <TrustStrip /> 

      {/* 5. THE EDGE: Why Vedic Wellness? (Monopoly & Marketing Support) */}
      <FranchiseBenefits />

      {/* 6. PROOF OF SCALE: 500+ Partners & 200+ Products */}
      <StatsSection />

      {/* 7. THE RANGE: In India, 'Product Variety' is the biggest draw. Move this up. */}
      <Categories />

      {/* 8. SOCIAL PROOF: What other distributors are saying */}
      <Testimonials />

      {/* 9. VISUAL PROOF: Show real warehouse, packaging, or office shots */}
      <MediaShowcase placementKey="HOME_SECONDARY" />

      {/* 10. IMMEDIATE TRUST: Certificates (GMP/ISO) and TrustStrip */}
      <TrustStrip /> 

      {/* 11. CLARITY: Simple 4-step onboarding */}
      <HowItWorks />

      {/* 12. FINAL CONVERSION: High-contrast CTA for Franchise Inquiry */}
      <CTABanner />
    </>
  );
}