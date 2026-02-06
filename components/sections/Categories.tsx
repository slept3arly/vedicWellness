"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import {
  fadeUpSoft,
  staggerFast,
  scaleIn
} from "@/app/animations";

const categories = [
  ["Immunity Care", "30+ Products"],
  ["Digestive Range", "25+ Products"],
  ["Liver Care", "15+ Products"],
  ["Skin & Hair", "20+ Products"],
  ["Pain Relief Oils", "10+ Products"],
  ["General Wellness", "40+ Products"],
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
          {categories.map(([title, count]) => (
            <motion.a
              key={title}
              variants={scaleIn}
              href="/products"
              className="group block"
            >
              <div
                className="
                  rounded-2xl 
                  bg-white/70 dark:bg-slate-900/60
                  p-6 
                  shadow-sm 
                  transition 
                  hover:-translate-y-1 hover:shadow-lg
                "
              >
                <div className="mb-4 inline-flex rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                  <Layers size={20} />
                </div>

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
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
