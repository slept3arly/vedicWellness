"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/app/animations";

import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";

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
        <motion.div variants={fadeUp}>
          <SectionHeading
            title="Testimonials"
            subtitle="Trusted by partners and distributors across India."
            align="left"
          />
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {list.map((t) => (
            <motion.div key={t.city} variants={fadeUp}>
              <GlassCard className="p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600/15 font-heading font-extrabold text-green-700 dark:text-green-300">
                    {t.name[0]}
                  </div>

                  <div>
                    <p className="font-heading text-sm font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </p>
                    <p className="font-body text-xs text-slate-600 dark:text-slate-300">
                      {t.city}
                    </p>
                  </div>
                </div>

                <p className="mt-4 font-quote text-base italic text-slate-700 dark:text-slate-200">
                  “{t.quote}”
                </p>

                <div className="mt-2 flex items-center gap-1 text-green-600 dark:text-green-400">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
