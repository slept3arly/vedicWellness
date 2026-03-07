"use client";

import {
  ShieldCheck,
  BadgeCheck,
  Truck,
  MapPin,
  Presentation,
  Leaf,
  FlaskConical,
  Star,
  Users,
  PackageCheck,
  Award,
  Globe,
} from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Quality Assured" },
  { icon: BadgeCheck, label: "GMP Certified" },
  { icon: Truck, label: "48hr Dispatch" },
  { icon: Presentation, label: "Marketing Support" },
  { icon: MapPin, label: "Monopoly Rights" },
  { icon: Leaf, label: "100% Ayurvedic" },
  { icon: FlaskConical, label: "ISO Grade Manufacturing" },
  { icon: Star, label: "5-Star Partner Reviews" },
  { icon: Users, label: "500+ Active Partners" },
  { icon: PackageCheck, label: "200+ PCD Products" },
  { icon: Award, label: "15+ Therapy Segments" },
  { icon: Globe, label: "Pan-India Network" },
];

const track = [...items, ...items];

export default function TrustStrip() {
  return (
    <section className="overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
      }}
    >
      <div
        className="marquee-track gap-3"
        style={{ animationDuration: "35s" }}
      >
        {track.map(({ icon: Icon, label }, i) => (
          <div
            key={`${label}-${i}`}
            className="shrink-0 flex items-center gap-2 rounded-full bg-white/80 dark:bg-black/50 border border-[var(--border-soft)] px-4 py-2 text-xs md:text-sm font-medium text-[var(--text-main)]"
          >
            <Icon size={14} className="text-[color:var(--brand-accent)]" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}