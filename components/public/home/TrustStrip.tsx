"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  BadgeCheck,
  Truck,
  MapPin,
  Presentation,
} from "lucide-react";

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
    <section className="py-6 md:py-8">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-2 md:gap-3 px-4"
      >
        {items.map(({ icon: Icon, label }) => (
          <motion.div
            key={label}
            variants={reveal}
            style={{ willChange: "opacity" }}
            className="flex items-center gap-2 rounded-full bg-white/80 dark:bg-black/50 px-4 py-2 text-xs md:text-sm font-medium"
          >
            <Icon size={14} className="text-[color:var(--brand-accent)]" />
            {label}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
