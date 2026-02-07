"use client";

import { motion } from "framer-motion";
import {
  Pill,
  Layers,
  Users,
  Truck,
  BadgeCheck,
  Clock,
} from "lucide-react";

import {
  staggerFast,
  fadeUp,
  cardInteraction,
} from "@/app/animations";

/* ---------------- DATA ---------------- */

const stats = [
  {
    icon: Pill,
    value: "200+",
    label: "PCD Pharma Products",
    sub: "WHO-GMP certified Ayurvedic product portfolio trusted nationwide.",
  },
  {
    icon: Layers,
    value: "15+",
    label: "Therapy Segments",
    sub: "Cardiac, Neuro, Ortho, Derma and wellness-focused segments.",
  },
  {
    icon: Users,
    value: "500+",
    label: "Franchise & PCD Partners",
    sub: "Active distributors and franchise partners across India.",
  },
  {
    icon: Truck,
    value: "PAN India",
    label: "Delivery Network",
    sub: "Fast and reliable pharmaceutical logistics nationwide.",
  },
  {
    icon: BadgeCheck,
    value: "ISO & GMP",
    label: "Certified Manufacturing",
    sub: "Quality-controlled manufacturing following global standards.",
  },
  {
    icon: Clock,
    value: "10+ Years",
    label: "Industry Experience",
    sub: "Proven expertise in Ayurvedic pharma manufacturing and distribution.",
  },
];

const mobileRadius = [
  "rounded-[52px]",
  "rounded-2xl",
  "rounded-lg",
  "rounded-lg",
  "rounded-2xl",
  "rounded-[52px]",
];

export default function StatsFloating() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-18">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-4 md:grid-cols-3"
      >
        {stats.map(({ icon: Icon, value, label, sub }, index) => (
          <motion.div
            key={label}
            variants={fadeUp}
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="group"
          >
            <motion.div
              variants={cardInteraction}
              className={`
                relative
                h-[110px] md:h-[160px]
                ${mobileRadius[index]}
                bg-white/75 dark:bg-black/45
                backdrop-blur-sm
                p-3 md:p-5
                transition-shadow duration-300
                group-hover:shadow-[0_16px_36px_rgba(2,101,54,0.26)]
              `}
            >
              {/* Glow */}
              <span
                className="
                  pointer-events-none
                  absolute inset-0
                  rounded-inherit
                  bg-[color:var(--brand-primary)]/25
                  blur-2xl
                  opacity-0
                  transition-opacity duration-300
                  group-hover:opacity-100
                "
              />

              {/* MOBILE CONTENT */}
              <div className="relative flex h-full flex-col items-center justify-center text-center md:hidden">
                <p className="text-lg font-bold text-[color:var(--brand-accent)]">
                  {value}
                </p>
                <p className="mt-0.5 text-xs font-semibold leading-tight">
                  {label}
                </p>
              </div>

              {/* DESKTOP CONTENT */}
              <div className="relative hidden h-full md:flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-[color:var(--brand-accent)]">
                    {value}
                  </p>
                  <p className="text-sm font-semibold leading-tight">
                    {label}
                  </p>
                  <p className="mt-1 text-xs text-muted leading-snug">
                    {sub}
                  </p>
                </div>

                <div className="relative flex items-center justify-center">
                  <span
                    className="
                      absolute inset-0
                      rounded-2xl
                      bg-[color:var(--brand-primary)]/35
                      blur-xl
                      opacity-40
                    "
                  />
                  <div
                    className="
                      relative z-10
                      flex items-center justify-center
                      h-11 w-11
                      rounded-xl
                      bg-[color:var(--brand-primary)]/20
                      text-[color:var(--brand-accent)]
                    "
                  >
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
