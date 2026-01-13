"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "./animations";

export default function Testimonials() {
  const list = [
    {
      name: "Distributor Partner",
      city: "Maharashtra",
      quote:
        "Excellent margins and fast dispatch. Monopoly rights gave us strong growth in our area.",
    },
    {
      name: "Medical Representative",
      city: "Uttar Pradesh",
      quote:
        "Marketing support and product literature helped us convert doctors faster and build trust.",
    },
    {
      name: "PCD Franchise Owner",
      city: "Gujarat",
      quote:
        "Quality products with repeat demand. Support team is responsive and schemes are attractive.",
    },
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
          <h2 className="font-heading text-3xl font-extrabold">Testimonials</h2>
          <p className="max-w-2xl font-body text-slate-600 dark:text-slate-300">
            Trusted by partners and distributors across India.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {list.map((t) => (
            <motion.div
              key={t.city}
              variants={fadeUp}
              className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600/15 font-heading font-extrabold text-green-700 dark:text-green-300">
                  {t.name[0]}
                </div>

                <div>
                  <p className="font-heading text-sm font-bold">{t.name}</p>
                  <p className="font-body text-xs text-slate-600 dark:text-slate-300">
                    {t.city}
                  </p>
                </div>
              </div>

              <p className="mt-4 font-quote text-base italic text-slate-700 dark:text-slate-200">
                “{t.quote}”
              </p>

              <div className="mt-2 items-center flex gap-1 text-green-600 dark:text-green-400">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
