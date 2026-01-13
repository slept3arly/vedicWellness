"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { fadeUp, stagger } from "./animations";

export default function ProductCategories() {
  const categories = [
    { title: "Immunity Care", count: "30+ Products" },
    { title: "Digestive Range", count: "25+ Products" },
    { title: "Liver Care", count: "15+ Products" },
    { title: "Skin & Hair", count: "20+ Products" },
    { title: "Pain Relief Oils", count: "10+ Products" },
    { title: "General Wellness", count: "40+ Products" },
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
        <motion.div variants={fadeUp} className="space-y-2">
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            Product Categories
          </h2>
          <p className="max-w-2xl font-body text-slate-600 dark:text-slate-300">
            Explore high-demand Ayurvedic categories designed for strong sales
            and repeat purchase.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <motion.a
              key={c.title}
              variants={fadeUp}
              href="/products"
              className="group rounded-3xl border border-slate-200 bg-white/60 p-6 text-center shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                <Layers size={20} />
              </div>

              <h3 className="font-heading text-lg font-bold">{c.title}</h3>
              <p className="mt-2 font-body text-sm text-slate-600 dark:text-slate-300">
                {c.count}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 font-body text-sm font-semibold text-green-700 dark:text-green-300">
                Explore{" "}
                <span className="transition group-hover:translate-x-1">→</span>
              </p>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
