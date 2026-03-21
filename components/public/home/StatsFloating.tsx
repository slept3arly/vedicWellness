"use client";

import { motion } from "framer-motion";
import { Pill, Layers, Users, Truck, BadgeCheck, Clock } from "lucide-react";
import { fadeUp, staggerFast } from "@/app/animations";
import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";

const stats = [
  { icon: Pill, value: "100+", label: "PCD Products", sub: "GMP certified portfolio." },
  { icon: Layers, value: "15+", label: "Therapy Segments", sub: "High-demand wellness ranges." },
  { icon: Users, value: "250+", label: "Partners", sub: "Active distributors nationwide." },
  { icon: Truck, value: "PAN India", label: "Logistics", sub: "Fast & reliable supply." },
  { icon: BadgeCheck, value: "ISO & GMP", label: "Certified", sub: "Global quality standards." },
  { icon: Clock, value: "10+ Years", label: "Experience", sub: "Proven pharma expertise." },
];

export default function StatsFloating() {
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
            title="Our Strength in Numbers"
            subtitle="A proven pharma partner built on quality, scale, and reliability."
          />
        </motion.header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map(({ icon: Icon, value, label, sub }) => (
            <motion.div key={label} variants={fadeUp} className="group">
              <Card className="bg-white/75 dark:bg-black/45 h-full flex flex-col justify-between">

                {/* Top — big value + sub/icon row (mirrors quote + impact/stars row) */}
                <div>
                  <p className="text-3xl md:text-4xl font-black text-foreground leading-none tracking-tight">
                    {value}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-accent text-xs font-semibold text-[color:var(--brand-accent)] uppercase tracking-wider">
                      {sub}
                    </span>
                    <div className="flex items-center justify-center text-[color:var(--brand-accent)] transition-transform duration-300 group-hover:scale-105">
                      <Icon size={16} />
                    </div>
                  </div>
                </div>

                {/* Bottom — divider + label (mirrors name/role block) */}
                <div className="mt-6 border-t border-foreground/10 pt-4">
                  <p className="font-heading font-semibold text-base text-foreground">
                    {label}
                  </p>
                </div>

              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}