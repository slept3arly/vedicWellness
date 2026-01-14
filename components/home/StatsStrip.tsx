"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/app/animations";
import GlassCard from "@/components/ui/GlassCard";

export default function StatsStrip() {
  const stats = [
    { value: "200+", label: "Products" },
    { value: "15+", label: "Categories" },
    { value: "500+", label: "Distributors" },
    { value: "PAN India", label: "Delivery" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <GlassCard className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="rounded-2xl bg-white/70 p-4 text-center shadow-sm dark:bg-slate-950/40"
            >
              <p className="font-heading text-3xl font-extrabold text-green-600 dark:text-green-400">
                {s.value}
              </p>
              <p className="mt-1 font-body text-sm text-slate-600 dark:text-slate-300">
                {s.label}
              </p>
            </motion.div>
          ))}
        </GlassCard>
      </motion.div>
    </section>
  );
}
