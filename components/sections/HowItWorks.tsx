"use client";

import { motion } from "framer-motion";
import { fadeUpSoft, staggerFast, scaleIn } from "@/app/animations";

const steps = [
  {
    title: "Apply for Franchise",
    desc: "Share your city/district and business details.",
  },
  {
    title: "Receive Catalog & Scheme",
    desc: "Get product list, prices and schemes quickly.",
  },
  {
    title: "Confirm Monopoly Rights",
    desc: "Finalize exclusive area and onboarding.",
  },
  {
    title: "Start Selling & Grow",
    desc: "Begin distribution immediately with support.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-8"
      >
        <motion.div variants={fadeUpSoft}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Simple onboarding process designed for fast franchise activation.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              variants={scaleIn}
              initial="rest"
              animate="rest"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 340, damping: 24, mass: 0.7 }}
              className="
                relative
                rounded-2xl
                bg-white/70 dark:bg-slate-900/60
                p-6
                shadow-sm
                hover:shadow-lg
              "
            >
              <div className="absolute right-4 top-2 text-7xl font-bold text-green-600/10 dark:text-green-400/10">
                {i + 1}
              </div>

              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                {s.title}
              </h3>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
