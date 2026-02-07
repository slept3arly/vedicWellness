"use client";

import { Pill, Layers, Users, Truck, BadgeCheck, Clock } from "lucide-react";

const stats = [
  { icon: Pill, value: "200+", label: "PCD Pharma Products", sub: "WHO-GMP certified Ayurvedic product portfolio trusted nationwide." },
  { icon: Layers, value: "15+", label: "Therapy Segments", sub: "Cardiac, Neuro, Ortho, Derma and wellness-focused segments." },
  { icon: Users, value: "500+", label: "Franchise & PCD Partners", sub: "Active distributors and franchise partners across India." },
  { icon: Truck, value: "PAN India", label: "Delivery Network", sub: "Fast and reliable pharmaceutical logistics nationwide." },
  { icon: BadgeCheck, value: "ISO & GMP", label: "Certified Manufacturing", sub: "Quality-controlled manufacturing following global standards." },
  { icon: Clock, value: "10+ Years", label: "Industry Experience", sub: "Proven expertise in Ayurvedic pharma manufacturing and distribution." },
];

const radius = [
  "rounded-[52px]",
  "rounded-2xl",
  "rounded-lg",
  "rounded-lg",
  "rounded-2xl",
  "rounded-[52px]",
];

export default function StatsFloating() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:px-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map(({ icon: Icon, value, label, sub }, i) => (
          <div
            key={label}
            className={`
              relative
              h-[110px] md:h-[160px]
              ${radius[i]}
              bg-white/75 dark:bg-black/45
               
              p-3 md:p-5
            `}
          >
            {/* Static glow (no animation) */}
            <div
              className="
                pointer-events-none absolute inset-0 rounded-inherit
                bg-gradient-to-br
                from-[color:var(--brand-primary)]/20
                to-transparent
                opacity-100
              "
            />

            {/* Mobile */}
            <div className="relative flex h-full flex-col items-center justify-center text-center md:hidden">
              <p className="text-lg font-bold text-[color:var(--brand-accent)]">
                {value}
              </p>
              <p className="mt-0.5 text-xs font-semibold leading-tight">
                {label}
              </p>
            </div>

            {/* Desktop */}
            <div className="relative hidden h-full md:flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-[color:var(--brand-accent)]">
                  {value}
                </p>
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-1 text-xs text-muted leading-snug">
                  {sub}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)]">
                <Icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
