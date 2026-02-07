"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  Microscope,
  HeartPulse,
  Shield,
  Globe,
} from "lucide-react";

import {
  fadeUpSoft,
  staggerFast,
  scaleIn,
  zLiftIcon,
  zLiftSpring,
} from "@/app/animations";

/* ---------------- DATA ---------------- */

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

        {/* Primary */}
        <div className="grid md:grid-cols-2 gap-6">
          {primary.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={scaleIn}
              initial="rest"
              animate="rest"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 340, damping: 24, mass: 0.7 }}
              className="
                group
                rounded-3xl
                bg-white/70 dark:bg-slate-900/60
                p-7
                shadow-sm
                hover:shadow-lg
              "
            >
              {/* Icon */}
              <motion.div
                variants={zLiftIcon}
                transition={zLiftSpring}
                className="relative mb-5 w-fit"
              >
                {/* Glow */}
                <div
                  className="
                    absolute inset-0
                    rounded-2xl
                    bg-green-500/30
                    blur-2xl
                    opacity-0
                    scale-90
                    transition-all duration-300
                    group-hover:opacity-100
                    group-hover:scale-110
                  "
                />

                <div
                  className="
                    relative z-10
                    flex items-center justify-center
                    h-14 w-14
                    rounded-2xl
                    bg-green-600/10
                    text-green-700
                    dark:text-green-300
                    shadow-sm
                    group-hover:shadow-xl
                  "
                >
                  <Icon size={26} />
                </div>
              </motion.div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Secondary */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {secondary.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={scaleIn}
              initial="rest"
              animate="rest"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 340, damping: 24, mass: 0.7 }}
              className="
                group
                rounded-2xl
                bg-white/70 dark:bg-slate-900/60
                p-6
                shadow-sm
                hover:shadow-lg
              "
            >
              <motion.div
                variants={zLiftIcon}
                transition={zLiftSpring}
                className="relative mb-4 w-fit"
              >
                <div
                  className="
                    absolute inset-0
                    rounded-2xl
                    bg-green-500/25
                    blur-2xl
                    opacity-0
                    scale-90
                    transition-all duration-300
                    group-hover:opacity-100
                    group-hover:scale-110
                  "
                />

                <div
                  className="
                    relative z-10
                    flex items-center justify-center
                    h-12 w-12
                    rounded-2xl
                    bg-green-600/10
                    text-green-700
                    dark:text-green-300
                    shadow-sm
                    group-hover:shadow-lg
                  "
                >
                  <Icon size={22} />
                </div>
              </motion.div>

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
