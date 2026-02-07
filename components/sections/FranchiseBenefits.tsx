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

import {
  fadeUpSoft,
  staggerFast,
  scaleIn,
  zLiftIcon,
  zLiftSpring,
} from "@/app/animations";

const benefits = [
  {
    icon: MapPin,
    title: "Monopoly Rights",
    desc: "Exclusive district or city territory for focused business growth.",
  },
  {
    icon: TrendingUp,
    title: "High Profit Margins",
    desc: "Strong margins designed for sustainable long-term earnings.",
  },
  {
    icon: Truck,
    title: "Fast & Reliable Supply",
    desc: "Consistent stock availability with quick dispatch across India.",
  },
  {
    icon: Megaphone,
    title: "Marketing Support",
    desc: "Visual aids, product literature and promotional materials.",
  },
  {
    icon: Gift,
    title: "Attractive Schemes",
    desc: "Regular offers and new product launch benefits.",
  },
  {
    icon: Clock,
    title: "Quick Onboarding",
    desc: "Simple process to start operations without delays.",
  },
];

export default function FranchiseBenefits() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-8"
      >
        <motion.div variants={fadeUpSoft}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Why Our Franchise Works
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Built for fast growth, strong profits and long-term partnership success.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, desc }) => (
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
              {/* Icon */}
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
                    rounded-2xl
                    bg-green-600/15
                    p-3
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
