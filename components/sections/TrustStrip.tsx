"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Truck, MapPin, Presentation } from "lucide-react";
import { staggerFast, reveal } from "@/app/animations";

const items = [
  { icon: ShieldCheck, label: "Quality Assured" },
  { icon: BadgeCheck, label: "Certified Manufacturing" },
  { icon: Truck, label: "Fast Dispatch" },
  { icon: Presentation, label: "Marketing Support" },
  { icon: MapPin, label: "Monopoly Rights" },
];

export default function TrustStrip() {
  return (
    <section className="py-8">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        className="flex flex-wrap justify-center gap-3"
      >
        {items.map(({ icon: Icon, label }) => (
          <motion.div
            key={label}
            variants={{
              hidden: { opacity: 0, y: -12 },
              show: { opacity: 1, y: 0 }
            }}
            className="flex items-center gap-2 rounded-full border border-green-500/25 bg-white/70 dark:bg-slate-900/60 px-4 py-2 text-sm shadow-sm"
          >
            <Icon size={16} className="text-green-600" />
            {label}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
