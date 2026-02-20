"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2 } from "lucide-react";

import { staggerFast, fadeUpSoft, reveal } from "@/app/animations";
import Chip from "@/components/public/ui/Chip";
import Button from "@/components/public/ui/Button";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-4 pt-10 pb-12 md:px-6 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-10 items-center">
      {/* LEFT */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="show"
        className="space-y-4 md:space-y-5"
      >
        <motion.div variants={fadeUpSoft}>
          <Chip className="flex items-center gap-2 w-fit text-xs md:text-sm">
            <Sparkles size={14} />
            Trusted Ayurvedic Franchise Network
          </Chip>
        </motion.div>

        <motion.h1
          variants={fadeUpSoft}
          className="text-4xl md:text-5xl font-extrabold leading-snug md:leading-tight text-slate-900 dark:text-white"
        >
          Build Your Monopoly With
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
            Vedic Wellness
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUpSoft}
          className="text-sm md:text-base text-slate-700 dark:text-slate-300"
        >
          Vedic Wellness (A Division of Innovia Drugs) enables serious PCD partners
          to build scalable, long-term businesses with GMP certified Ayurvedic
          formulations and monopoly rights.
        </motion.p>

        <motion.div variants={fadeUpSoft} className="flex gap-3 pt-2">
          <Button size="lg" onClick={() => router.push("/contact")}>
            Apply for Franchise
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push("/products")}
          >
            View Products
          </Button>
        </motion.div>
      </motion.div>

      {/* RIGHT */}
      <motion.div variants={reveal} initial="hidden" animate="show">
        <div className="relative rounded-3xl bg-white/70 dark:bg-black/45 p-6 md:p-8 shadow-[0_24px_60px_rgba(2,101,54,0.25)]">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[color:var(--brand-primary)]/20 blur-2xl opacity-40" />

          <div className="relative space-y-4">
            <h3 className="text-lg md:text-xl font-semibold">
              Why Serious Partners Choose Us
            </h3>

            <ul className="space-y-3 text-sm text-muted">
              {[
                "Monopoly-based PCD model",
                "GMP certified manufacturing",
                "Fast dispatch & logistics support",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 text-[color:var(--brand-accent)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
