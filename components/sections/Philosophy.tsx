"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  Microscope,
  HeartPulse,
  Shield,
  Beaker,
  Globe
} from "lucide-react";

import {
  fadeUpSoft,
  staggerFast,
  scaleIn
} from "@/app/animations";

const primary = [
  {
    icon: Leaf,
    title: "Authentic Ayurveda",
    desc: "Traditional herbal formulations crafted from time-tested medicinal plants with proven effectiveness.",
  },
  {
    icon: Microscope,
    title: "Modern Pharma Excellence",
    desc: "Manufactured in GMP-certified facilities with strict quality control and safety testing.",
  },
];

const secondary = [
  {
    icon: Shield,
    title: "Safe & Reliable",
    desc: "Consistent potency, purity, and batch-level quality assurance.",
  },
  {
    icon: HeartPulse,
    title: "Wellness Driven",
    desc: "Focused on long-term health and preventive care solutions.",
  },
  {
    icon: Globe,
    title: "Scalable Reach",
    desc: "Designed for mass accessibility across India.",
  },
];

export default function Philosophy() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-8"
      >

        {/* Heading */}
        <motion.div variants={fadeUpSoft}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Our Philosophy
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300 max-w-2xl">
            Combining ancient Ayurvedic wisdom with modern pharmaceutical
            science to deliver safe, effective and scalable wellness solutions.
          </p>
        </motion.div>

        {/* Primary pillars */}
        <div className="grid md:grid-cols-2 gap-6">
          {primary.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={scaleIn}
              className="
                rounded-3xl
                bg-white/70 dark:bg-slate-900/60
                p-7
                shadow-sm
                transition
                hover:-translate-y-1 hover:shadow-lg
              "
            >
              <div className="mb-4 inline-flex rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                <Icon size={26} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Supporting principles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {secondary.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={scaleIn}
              className="
                rounded-2xl
                bg-white/70 dark:bg-slate-900/60
                p-6
                shadow-sm
                transition
                hover:-translate-y-1 hover:shadow-lg
              "
            >
              <div className="mb-3 inline-flex rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                <Icon size={22} />
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}
