"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/app/animations";

import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function HowItWorks() {
  const steps = [
    { title: "Apply for Franchise", desc: "Share your city/district and business details to get started." },
    { title: "Receive Catalog & Scheme", desc: "We send product list, price list, and current schemes quickly." },
    { title: "Confirm Monopoly Rights", desc: "Finalize area monopoly and complete onboarding documentation." },
    { title: "Start Selling & Grow", desc: "Get support materials and start distribution immediately." },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-10"
      >
        <motion.div variants={fadeUp}>
          <SectionHeading
            title="How It Works"
            subtitle="Simple onboarding process designed for fast franchise activation."
            align="left"
          />
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <motion.div key={s.title} variants={fadeUp}>
              <GlassCard className="relative overflow-hidden p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute right-2 top-2 font-heading text-8xl font-extrabold text-green-600/10 dark:text-green-400/10">
                  {idx + 1}
                </div>

                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 font-body text-sm text-slate-600 dark:text-slate-300">
                  {s.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
