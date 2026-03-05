"use client";

import { motion } from "framer-motion";
import {
  ShieldPlus,
  Leaf,
  Droplet,
  Sparkles,
  Flame,
  HeartPulse,
} from "lucide-react";

import { fadeUp, staggerFast } from "@/app/animations";
import Card from "@/components/public/ui/Card";

const categories = [
  { title: "Immunity Care", count: "30+ Products", icon: ShieldPlus },
  { title: "Digestive Range", count: "25+ Products", icon: Leaf },
  { title: "Liver Care", count: "15+ Products", icon: Droplet },
  { title: "Skin & Hair", count: "20+ Products", icon: Sparkles },
  { title: "Pain Relief Oils", count: "10+ Products", icon: Flame },
  { title: "General Wellness", count: "40+ Products", icon: HeartPulse },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-20">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-12"
      >
        {/* Heading */}
        <motion.header
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Product Categories
          </h2>
          <p className="mt-2 text-base md:text-lg text-muted">
            High-demand Ayurvedic ranges designed to drive repeat sales and
            long-term franchise growth.
          </p>
        </motion.header>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
          {categories.map(({ title, count, icon: Icon }) => (
            <motion.a
              key={title}
              href="/products"
              variants={fadeUp}
              className="group"
            >
              <Card
                className="
                  h-full
                  bg-white/75 dark:bg-black/45
                  transition-shadow duration-300
                  group-hover:shadow-[0_20px_50px_rgba(2,101,54,0.3)]
                "
              >
                <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-center md:justify-between gap-5">
                  {/* Text */}
                  <div className="space-y-1">
                    <h3 className="text-base md:text-lg font-semibold">
                      {title}
                    </h3>
                    <p className="text-sm text-muted">{count}</p>

                    <span className="inline-flex items-center gap-1 pt-2 text-sm font-semibold text-[color:var(--brand-accent)]">
                      Explore
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="relative flex items-center justify-center">
                    {/* Glow */}
                    <span
                      className="
                        absolute inset-0
                        rounded-2xl
                        bg-[color:var(--brand-primary)]/35
                        blur-xl
                        opacity-40
                        transition-opacity duration-300
                        group-hover:opacity-100
                      "
                    />

                    {/* Icon background */}
                    <div
                      className="
                        relative z-10
                        flex items-center justify-center
                        h-14 w-14 md:h-16 md:w-16
                        rounded-2xl
                        bg-[color:var(--brand-primary)]/20
                        text-[color:var(--brand-accent)]
                      "
                    >
                      <Icon
                        className="h-8 w-8 md:h-9 md:w-9"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
