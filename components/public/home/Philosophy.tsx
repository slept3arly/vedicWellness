"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  Microscope,
  HeartPulse,
  Shield,
  TrendingUp,
  Megaphone,
} from "lucide-react";

import { fadeUp, staggerFast } from "@/app/animations";
import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";

const cards = [
  {
    icon: Leaf,
    title: "Clinically Proven Formulations",
    descShort:
      "Time-tested Ayurvedic blends delivering reliable health outcomes.",
    descLong:
      "Time-tested Ayurvedic blends backed by consistent therapeutic performance, ensuring reliable and measurable health outcomes.",
    num: "01",
  },
  {
    icon: Microscope,
    title: "Precision Pharma Manufacturing",
    descShort:
      "Produced in GMP-certified facilities with strict quality control.",
    descLong:
      "Manufactured in GMP-certified facilities under strict quality protocols, ensuring purity, consistency, and compliance.",
    num: "02",
  },
  {
    icon: Shield,
    title: "Trusted Product Portfolio",
    descShort:
      "Carefully curated products focused on safety and reliability.",
    descLong:
      "A curated portfolio prioritizing safety, efficacy, and long-term credibility to ensure consistent patient trust.",
    num: "03",
  },
  {
    icon: HeartPulse,
    title: "High-Growth Wellness",
    descShort:
      "Focused on immunity, digestion, liver care, and wellness.",
    descLong:
      "Aligned with high-demand segments including immunity, digestion, liver care, and holistic wellness solutions.",
    num: "04",
  },
  {
    icon: TrendingUp,
    title: "Exclusive Territory",
    descShort:
      "Monopoly-based franchise model with strong margin potential.",
    descLong:
      "Structured franchise model offering exclusive territory rights, enabling higher margins with reduced competition.",
    num: "05",
  },
  {
    icon: Megaphone,
    title: "End-to-End Support",
    descShort:
      "Comprehensive marketing and promotional assistance.",
    descLong:
      "Complete marketing, branding, and strategic growth support to accelerate visibility and sales performance.",
    num: "06",
  },
];

export default function Philosophy() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14 md:px-6 md:py-20">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-12"
      >
        {/* Header */}
        <motion.header
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto"
        >
          <PageHeader
            title="Our Philosophy"
            subtitle="Ancient Ayurvedic wisdom combined with modern pharmaceutical standards."
          />
        </motion.header>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-5">
          {cards.map(({ icon: Icon, title, descShort, descLong, num }) => (
            <motion.div key={title} variants={fadeUp} className="group h-full">
              <Card className="bg-white/75 dark:bg-black/45 !p-0 overflow-hidden h-full flex">

                {/* ── MOBILE ── */}
                <div className="flex flex-col h-full w-full md:hidden">
                  
                  {/* Top strip */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--border-soft)] bg-[color:var(--brand-primary)]/5">
                    <span className="text-[10px] font-black tracking-widest text-[color:var(--brand-accent)] opacity-60">
                      {num}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)]">
                      <Icon size={15} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center items-center text-center gap-2 px-4 py-4 flex-1">
                    
                    {/* TITLE */}
                    <h3 className="font-heading font-semibold text-sm leading-snug tracking-tight line-clamp-2 min-h-[2.8rem]">
                      {title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-xs text-muted leading-[1.5] line-clamp-3 min-h-[3.6rem]">
                      {descShort}
                    </p>

                  </div>
                </div>

                {/* ── DESKTOP ── */}
                <div className="hidden md:flex items-stretch w-full">
                  
                  {/* Left strip */}
                  <div className="flex flex-col items-center justify-between px-4 py-5 border-r border-[var(--border-soft)] min-w-[64px] bg-[color:var(--brand-primary)]/5 group-hover:bg-[color:var(--brand-primary)]/10 transition-colors duration-300">
                    <span className="text-[10px] font-black tracking-widest text-[color:var(--brand-accent)] opacity-60">
                      {num}
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)] transition-colors duration-300 group-hover:bg-[color:var(--brand-primary)]/35">
                      <Icon size={18} />
                    </div>

                    <span className="opacity-0 text-[10px]">{num}</span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center gap-2 px-5 py-5 max-w-[520px]">
                    
                    {/* TITLE */}
                    <h3 className="font-heading font-semibold text-base leading-snug tracking-tight line-clamp-2 min-h-[3.2rem]">
                      {title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-sm text-muted leading-[1.6] line-clamp-2 min-h-[3.2rem]">
                      {descLong}
                    </p>

                  </div>
                </div>

              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}