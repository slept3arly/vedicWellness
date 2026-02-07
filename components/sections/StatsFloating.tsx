"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { staggerFast, cardVariants, zLiftSpring } from "@/app/animations";
import FloatingIcon from "@/components/ui/FloatingIcon";

/* ---------------- SEO-Optimised Stats ---------------- */

const stats = [
  {
    value: "200+",
    label: "PCD Pharma Products",
    sub: "WHO-GMP certified product range",
    icon: "pill",
  },
  {
    value: "15+",
    label: "Therapy Segments",
    sub: "Cardiac, Neuro, Derma & more",
    icon: "layers",
  },
  {
    value: "500+",
    label: "Franchise Partners",
    sub: "Trusted pharma distributors",
    icon: "users",
  },
  {
    value: "PAN India",
    label: "Delivery Network",
    sub: "Fast pharma logistics nationwide",
    icon: "truck",
  },
] as const;

export default function StatsFloating() {
  const [active, setActive] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const handlePress = (label: string) => {
    if (!isMobile) return;

    setActive(label);

    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }
  };

  const releasePress = () => setActive(null);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-5"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={cardVariants}
            initial="hidden"
            animate={active === s.label ? "hold" : "rest"}
            onPointerDown={() => handlePress(s.label)}
            onPointerUp={releasePress}
            onPointerLeave={releasePress}
            whileHover={!isMobile ? { y: -6, scale: 1.015 } : undefined}
            transition={zLiftSpring}
            className="
              relative overflow-hidden
              rounded-2xl
              bg-white/70 dark:bg-slate-900/60
              border border-green-600/15
              p-6 text-center shadow-sm
              hover:shadow-md
              select-none
            "
          >
            {active === s.label && (
              <>
                <FloatingIcon type={s.icon} />
                <FloatingIcon type={s.icon} />
              </>
            )}

            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {s.value}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              {s.label}
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {s.sub}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
