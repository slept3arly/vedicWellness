"use client";

import { Pill, Layers, Users, Truck, BadgeCheck, Clock } from "lucide-react";

const stats = [
  { icon: Pill, value: "200+", label: "PCD Products", sub: "WHO-GMP certified portfolio." },
  { icon: Layers, value: "15+", label: "Therapy Segments", sub: "High-demand wellness ranges." },
  { icon: Users, value: "500+", label: "Partners", sub: "Active distributors nationwide." },
  { icon: Truck, value: "PAN India", label: "Logistics", sub: "Fast & reliable supply." },
  { icon: BadgeCheck, value: "ISO & GMP", label: "Certified", sub: "Global quality standards." },
  { icon: Clock, value: "10+ Years", label: "Experience", sub: "Proven pharma expertise." },
];

export default function StatsFloating() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, value, label, sub }) => (
          <div
            key={label}
            className="relative min-h-[140px] rounded-2xl bg-white/75 dark:bg-black/45 p-4"
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-xl md:text-3xl font-bold text-[color:var(--brand-accent)]">
                  {value}
                </p>
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-1 text-xs text-muted">{sub}</p>
              </div>
              <div className="self-end mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)]">
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
