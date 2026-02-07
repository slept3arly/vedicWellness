"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  ShieldCheck,
  Truck,
  MapPin,
  Presentation,
  PackageCheck,
} from "lucide-react";

import GlassCard from "@/components/old_files/ui/GlassCard";
import Chip from "@/components/public/ui/Chip";

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
      >
        <GlassCard className="-mt-2 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {items.map(({ icon: Icon, label }) => (
              <Chip
                key={label}
                className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-950/40 font-medium"
              >
                <Icon size={16} className="text-green-600 dark:text-green-400" />
                {label}
              </Chip>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
