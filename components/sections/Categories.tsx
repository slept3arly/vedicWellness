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
    <section className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-14">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-6 md:space-y-8"
      >
        {/* Heading */}
        <motion.div variants={fadeUpSoft}>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Product Categories
          </h2>
          <p className="mt-1 text-sm md:text-base text-slate-600 dark:text-slate-300">
            High-demand Ayurvedic ranges built for strong sales and repeat customers.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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
                  relative
                  flex flex-col
                  rounded-2xl
                  bg-white/70 dark:bg-slate-900/60
                  p-4 lg:p-6
                  shadow-sm
                  transition
                  active:scale-[0.98]
                  active:bg-green-50 dark:active:bg-slate-800
                  active:shadow-md
                  lg:hover:-translate-y-1 lg:hover:shadow-lg
                  overflow-hidden
                "
              >
                {/* Icon — right aligned on all screens */}
                <motion.div
                  variants={zLiftIcon}
                  transition={zLiftSpring}
                  className="absolute top-4 right-4 lg:top-6 lg:right-6"
                >
                  <div
                    className="
                      flex items-center justify-center
                      h-10 w-10 lg:h-20 lg:w-20
                      rounded-xl lg:rounded-2xl
                      bg-green-600/10
                      text-green-700 dark:text-green-300
                      shadow-sm
                      lg:group-hover:shadow-xl
                    "
                  >
                    <Icon size={20} className="lg:hidden" />
                    <Icon size={40} strokeWidth={1.5} className="hidden lg:block" />
                  </div>
                </motion.div>

                {/* Content (extra right padding to avoid icon overlap) */}
                <div className="pr-12 lg:pr-24">
                  <h3 className="text-sm lg:text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                  </h3>

                  <p className="mt-1 text-xs lg:text-sm text-slate-600 dark:text-slate-300">
                    {count}
                  </p>
                </div>

                {/* CTA */}
                <p className="mt-3 text-xs lg:text-sm font-semibold text-green-700 dark:text-green-300 flex items-center gap-1">
                  Explore
                  <span className="transition group-hover:translate-x-1">→</span>
                </p>
              </motion.div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
