"use client";

import PageHeader from "@/components/public/ui/PageHeader";
import ExpandableSeoContent from "@/components/public/ui/ExpandableSeoContent";
import EditorialCarousel from "@/components/public/home/EditorialCarousel";

export default function Philosophy() {
  return (
    <section className="relative w-full px-4 py-10 md:px-6 md:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl space-y-7 md:space-y-9">
        <header className="mx-auto max-w-3xl text-center">
          <PageHeader
            badge={<span className="font-accent text-xs uppercase tracking-[0.3em] text-[var(--brand-accent)]">Our Philosophy</span>}
            title="Where Ayurvedic Heritage Meets Pharmaceutical Rigour"
            size="lg"
          />
        </header>

        <EditorialCarousel />

        <ExpandableSeoContent
          title="Strategic Market Development & Regional Scalability"
          preview="Our cooperative operational frame is explicitly custom-tailored for regional enterprise acceleration. By combining centuries-old dynamic holistic therapies with strict automated Western manufacturing protocols, we supply verified business foundations."
        >
          <p>
            Partners gain priority access to complete digital supply catalogs, fast batching setups, and local consumer discovery pipelines.
          </p>
          <p>
            This structural optimization ensures minimal turnaround bottlenecks, protecting immediate operational margins while expanding geographical footprints. Dedicated account technicians actively manage distribution parameters across connected territories to ensure scalable compound development alongside long-term commercial compliance.
          </p>
        </ExpandableSeoContent>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-transform,
          .transition-opacity,
          .transition-colors,
          .transition-all {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
