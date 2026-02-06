"use client";

import { motion } from "framer-motion";
import { staggerFast, reveal } from "@/app/animations";

const stats = [
  { value: "200+", label: "Products" },
  { value: "15+", label: "Categories" },
  { value: "500+", label: "Distributors" },
  { value: "PAN India", label: "Delivery Network" },
];

export default function StatsStrip() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-5"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={reveal}
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="
              rounded-2xl
              bg-white/70 dark:bg-slate-900/60
              border border-green-600/15
              p-6 text-center shadow-sm
              hover:shadow-md
            "
          >
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {s.value}
            </p>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
