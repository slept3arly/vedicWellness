"use client";

import { motion } from "framer-motion";
import { BadgeCheck, ShieldCheck, Truck, MapPin, Presentation, PackageCheck } from "lucide-react";

export default function TrustRow() {
  const items = [
    { icon: ShieldCheck, label: "Quality Assured" },
    { icon: BadgeCheck, label: "ISO Certified" },
    { icon: PackageCheck, label: "Ayurvedic Range" },
    { icon: Truck, label: "Fast Dispatch" },
    { icon: Presentation, label: "Marketing Support" },
    { icon: MapPin, label: "Monopoly Rights" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        className="-mt-2 rounded-3xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/40"
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          {items.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
            >
              <Icon size={16} className="text-green-600 dark:text-green-400" />
              {label}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
