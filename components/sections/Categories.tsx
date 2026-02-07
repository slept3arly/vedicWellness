"use client";

import { motion } from "framer-motion";
import {
  ShieldPlus,
  Leaf,
  Droplet,
  Sparkles,
  Flame,
  HeartPulse,
} from "lucide-react";

import {
  fadeUpSoft,
  staggerFast,
  scaleIn,
  zLiftIcon,
  zLiftSpring,
} from "@/app/animations";

/* ---------------- DATA ---------------- */

const categories = [
  { title: "Immunity Care", count: "30+ Products", icon: ShieldPlus },
  { title: "Digestive Range", count: "25+ Products", icon: Leaf },
  { title: "Liver Care", count: "15+ Products", icon: Droplet },
  { title: "Skin & Hair", count: "20+ Products", icon: Sparkles },
  { title: "Pain Relief Oils", count: "10+ Products", icon: Flame },
  { title: "General Wellness", count: "40+ Products", icon: HeartPulse },
];

export default function Categories() {
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
            Product Categories
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            High-demand Ayurvedic ranges built for strong sales and repeat customers.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ title, count, icon: Icon }) => (
            <motion.a
              key={title}
              href="/products"
              variants={scaleIn}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="group block"
            >
              <motion.div
                className="
                  relative flex items-center justify-between
                  rounded-2xl
                  bg-white/70 dark:bg-slate-900/60
                  p-6
                  shadow-sm
                  transition
                  hover:-translate-y-1 hover:shadow-lg
                  overflow-hidden
                "
              >
                {/* Left content */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {count}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-green-700 dark:text-green-300 flex items-center gap-1">
                    Explore
                    <span className="transition group-hover:translate-x-1">→</span>
                  </p>
                </div>

                {/* Icon + Glow */}
                <motion.div
                  variants={zLiftIcon}
                  transition={zLiftSpring}
                  className="relative"
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

                  {/* Icon */}
                  <div
                    className="
                      relative z-10
                      flex items-center justify-center
                      h-20 w-20
                      rounded-2xl
                      bg-green-600/10
                      text-green-700
                      dark:text-green-300
                      shadow-sm
                      transition-shadow duration-300
                      group-hover:shadow-xl
                    "
                  >
                    <Icon size={40} strokeWidth={1.5} />
                  </div>
                </motion.div>
              </motion.div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
