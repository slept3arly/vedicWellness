"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  Microscope,
  HeartPulse,
  Shield,
  TrendingUp,
  Megaphone,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { fadeUp, staggerFast } from "@/app/animations";
import Card from "@/components/public/ui/Card";

const cards = [
  {
    icon: Leaf,
    title: "Authentic Ayurvedic Formulations",
    desc: "Time-tested Ayurvedic formulations designed for consistent therapeutic outcomes.",
  },
  {
    icon: Microscope,
    title: "Modern Pharma Manufacturing",
    desc: "Manufactured in GMP-certified facilities with strict quality control.",
  },
  {
    icon: Shield,
    title: "Safe & Reliable Portfolio",
    desc: "Carefully curated products focused on safety and long-term credibility.",
  },
  {
    icon: HeartPulse,
    title: "High Demand Segments",
    desc: "Products aligned with immunity, digestion, liver care and wellness.",
  },
  {
    icon: TrendingUp,
    title: "High Margins & Monopoly",
    desc: "Structured franchise model offering monopoly rights and strong margins.",
  },
  {
    icon: Megaphone,
    title: "Marketing Support",
    desc: "End-to-end promotional and strategic growth support.",
  },
];

export default function Philosophy() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-4 py-14 md:px-6 md:py-20">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-12"
      >
        <motion.header variants={fadeUp} className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold">Our Philosophy</h2>
          <p className="mt-2 text-muted">
            Ancient Ayurvedic wisdom combined with modern pharmaceutical standards.
          </p>
        </motion.header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {cards.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp}>
              <Card
                onClick={() => router.push("/blogs")}
                className="cursor-pointer bg-white/75 dark:bg-black/45"
              >
                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)]">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted">{desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
