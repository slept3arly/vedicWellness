"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  TrendingUp,
  Truck,
  Megaphone,
  Gift,
  Clock,
} from "lucide-react";

import {
  fadeUp,
  staggerFast,
  cardInteraction,
} from "@/app/animations";

import Card from "@/components/public/ui/Card";

/* ---------------- DATA ---------------- */

const benefits = [
  {
    icon: MapPin,
    title: "Monopoly Rights",
    desc: "Exclusive district or city territory for focused business growth.",
  },
  {
    icon: TrendingUp,
    title: "High Profit Margins",
    desc: "Strong margins designed for sustainable long-term earnings.",
  },
  {
    icon: Truck,
    title: "Fast & Reliable Supply",
    desc: "Consistent stock availability with quick dispatch across India.",
  },
  {
    icon: Megaphone,
    title: "Marketing Support",
    desc: "Visual aids, product literature and promotional materials.",
  },
  {
    icon: Gift,
    title: "Attractive Schemes",
    desc: "Regular offers and new product launch benefits.",
  },
  {
    icon: Clock,
    title: "Quick Onboarding",
    desc: "Simple process to start operations without delays.",
  },
];

export default function FranchiseBenefits() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-20">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-12"
      >
        {/* Heading */}
        <motion.header
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Our Franchise Works
          </h2>
          <p className="mt-2 text-base md:text-lg text-muted">
            Built for fast growth, strong profits, and long-term partnership success.
          </p>
        </motion.header>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp} className="group">
              <motion.div
                variants={cardInteraction}
                initial="rest"
                whileHover="hover"
              >
                <Card
                  className="
                    h-full
                    bg-white/75 dark:bg-black/45
                     
                    transition-shadow duration-300
                    group-hover:shadow-[0_20px_50px_rgba(2,101,54,0.3)]
                  "
                >
                  <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4">
                    {/* Icon */}
                    <div className="relative">
                      {/* Glow */}
                      <span
                        className="
                          absolute inset-0
                          rounded-2xl
                          bg-[color:var(--brand-primary)]/35
                          blur-xl
                          opacity-40
                          transition-all duration-300
                          group-hover:opacity-100
                          group-hover:blur-2xl
                        "
                      />

                      {/* Icon bg */}
                      <div
                        className="
                          relative z-10
                          flex items-center justify-center
                          h-14 w-14
                          rounded-2xl
                          bg-[color:var(--brand-primary)]/20
                          text-[color:var(--brand-accent)]
                        "
                      >
                        <Icon size={26} />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-1">
                      <h3 className="text-base md:text-lg font-semibold">
                        {title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
