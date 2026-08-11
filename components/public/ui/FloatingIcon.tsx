"use client";

import { m } from "framer-motion";
import { Pill, Layers, Users, Truck } from "lucide-react";

const iconMap = {
  pill: Pill,
  layers: Layers,
  users: Users,
  truck: Truck,
};

type IconType = keyof typeof iconMap;

export default function FloatingIcon({ type }: { type: IconType }) {
  const Icon = iconMap[type];

  return (
    <m.div
      initial={{ opacity: 0, y: 8, scale: 0.6 }}
      animate={{ opacity: [0, 1, 0], y: [-6, -26], scale: [0.6, 1, 0.9] }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[var(--brand-primary)]/40 pointer-events-none"
    >
      <Icon size={18} />
    </m.div>
  );
}
