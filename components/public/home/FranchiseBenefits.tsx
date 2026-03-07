"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  TrendingUp,
  Truck,
  Megaphone,
  Gift,
  Clock,
} from "lucide-react";

import { fadeUp, staggerFast } from "@/app/animations";
import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";

const benefits = [
  { icon: MapPin, title: "Monopoly Rights", desc: "Exclusive district or city territory for focused business growth.", num: "01" },
  { icon: TrendingUp, title: "High Profit Margins", desc: "Strong margins designed for sustainable long-term earnings.", num: "02" },
  { icon: Truck, title: "Fast & Reliable Supply", desc: "Consistent stock availability with quick dispatch across India.", num: "03" },
  { icon: Megaphone, title: "Marketing Support", desc: "Visual aids, product literature and promotional materials.", num: "04" },
  { icon: Gift, title: "Attractive Schemes", desc: "Regular offers and new product launch benefits.", num: "05" },
  { icon: Clock, title: "Quick Onboarding", desc: "Simple process to start operations without delays.", num: "06" },
];

export default function FranchiseBenefits() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-20">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-12"
      >
        <motion.header variants={fadeUp} className="text-center max-w-2xl mx-auto">
          <PageHeader
            title="Why Our Franchise Works"
            subtitle="Built for fast growth, strong profits, and long-term partnership success."
          />
        </motion.header>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
          {benefits.map(({ icon: Icon, title, desc, num }) => (
            <motion.div key={title} variants={fadeUp} className="group">
              <Card className="bg-white/75 dark:bg-black/45 !p-0 overflow-hidden h-full">

                {/* ── MOBILE: vertical 2-col card ── */}
                <div className="flex flex-col h-full md:hidden">
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--border-soft)] bg-[color:var(--brand-primary)]/5">
                    <span className="text-[10px] font-black tracking-widest text-[color:var(--brand-accent)] opacity-60">
                      {num}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)]">
                      <Icon size={15} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 px-4 py-3 flex-1">
                    <h3 className="font-heading font-semibold text-sm leading-snug">{title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>

                {/* ── DESKTOP: horizontal strip ── */}
                <div className="hidden md:flex items-stretch gap-0">
                  <div className="flex flex-col items-center justify-between gap-3 px-4 py-5 border-r border-[var(--border-soft)] min-w-[64px] bg-[color:var(--brand-primary)]/5 group-hover:bg-[color:var(--brand-primary)]/10 transition-colors duration-300">
                    <span className="text-[10px] font-black tracking-widest text-[color:var(--brand-accent)] opacity-60">
                      {num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)] transition-colors duration-300 group-hover:bg-[color:var(--brand-primary)]/35">
                      <Icon size={18} />
                    </div>
                    <span className="opacity-0 text-[10px]">{num}</span>
                  </div>
                  <div className="flex flex-col justify-center gap-1.5 px-5 py-5">
                    <h3 className="font-heading font-semibold text-base leading-snug">{title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{desc}</p>
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