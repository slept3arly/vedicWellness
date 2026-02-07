"use client";

import { Layers } from "lucide-react";

import GlassCard from "@/components/old_files/ui/GlassCard";
import SectionHeading from "@/components/public/ui/SectionHeading";

export default function ProductCategories() {
  const categories = [
    { title: "Immunity Care", count: "30+ Products" },
    { title: "Digestive Range", count: "25+ Products" },
    { title: "Liver Care", count: "15+ Products" },
    { title: "Skin & Hair", count: "20+ Products" },
    { title: "Pain Relief Oils", count: "10+ Products" },
    { title: "General Wellness", count: "40+ Products" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 space-y-10">
      <SectionHeading
        title="Product Categories"
        subtitle="Explore high-demand Ayurvedic categories designed for strong sales and repeat purchase."
        align="left"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <a
            key={c.title}
            href="/products"
            className="group block"
          >
            <GlassCard className="p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                <Layers size={20} />
              </div>

              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                {c.title}
              </h3>

              <p className="mt-2 font-body text-sm text-slate-600 dark:text-slate-300">
                {c.count}
              </p>

              <p className="mt-4 inline-flex items-center gap-2 font-body text-sm font-semibold text-green-700 dark:text-green-300">
                Explore
                <span className="transition group-hover:translate-x-1">→</span>
              </p>
            </GlassCard>
          </a>
        ))}
      </div>
    </section>
  );
}
