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

import {
  fadeUp,
  staggerFast,
  cardInteraction,
} from "@/app/animations";

/* ---------------- DATA ---------------- */

const cards = [
  {
    icon: Leaf,
    badge: "PCD Pharma Franchise Advantage",
    title: "Authentic Ayurvedic Formulations",
    desc: "Time-tested Ayurvedic formulations designed for consistent therapeutic outcomes and strong doctor acceptance.",
  },
  {
    icon: Microscope,
    badge: "GMP & Regulatory Compliance",
    title: "Modern Pharma Manufacturing",
    desc: "Manufactured in GMP-certified facilities with strict quality control, documentation, and batch-level testing.",
  },
  {
    icon: Shield,
    badge: "Low Risk Business Model",
    title: "Safe & Reliable Product Portfolio",
    desc: "A carefully curated range focused on safety, purity, and long-term market credibility for franchise partners.",
  },
  {
    icon: HeartPulse,
    badge: "High Demand Wellness Segments",
    title: "Wellness-Driven Product Range",
    desc: "Products aligned with high-demand categories like immunity, digestion, liver care, and lifestyle wellness.",
  },
  {
    icon: TrendingUp,
    badge: "Scalable PCD Growth Opportunity",
    title: "High Margins & Monopoly Rights",
    desc: "A structured PCD pharma franchise model offering monopoly rights, attractive margins, and marketing support.",
  },
  {
    icon: Megaphone,
    badge: "Partner Enablement",
    title: "Marketing & Growth Support",
    desc: "End-to-end promotional and strategic support to help franchise partners scale faster and stronger.",
  },
];

export default function Philosophy() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-12"
      >
        {/* ================= HEADING ================= */}
        <motion.header
          variants={fadeUp}
          className="max-w-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Our Philosophy
          </h2>
          <p className="mt-2 text-base md:text-lg text-slate-600 dark:text-slate-300">
            Ancient Ayurvedic wisdom combined with modern pharmaceutical
            standards to build a profitable and sustainable PCD pharma franchise.
          </p>
        </motion.header>

        {/* ================= MOBILE: STATIC GRID ================= */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              onClick={() => router.push("/blogs")}
              className="
                cursor-pointer
                rounded-2xl
                bg-white/80 dark:bg-black/45
                p-4
                shadow-sm
              "
            >
              {/* Icon */}
              <div className="relative mb-3 w-fit">
                <div
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    bg-[color:var(--brand-primary)]/20
                    text-[color:var(--brand-accent)]
                  "
                >
                  <Icon size={20} strokeWidth={1.5} />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-300">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP GRID (UNCHANGED) ================= */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group"
              >
                <motion.div
                  variants={cardInteraction}
                  initial="rest"
                  whileHover="hover"
                  className="
                    h-full
                    rounded-3xl
                    bg-white/75 dark:bg-black/45
                    p-6
                    transition-shadow duration-300
                    group-hover:shadow-[0_20px_50px_rgba(2,101,54,0.3)]
                  "
                >
                  <IconBlock Icon={Icon} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {desc}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- ICON BLOCK ---------------- */

function IconBlock({ Icon }: { Icon: any }) {
  return (
    <div className="relative mb-4 w-fit">
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
      <div
        className="
          relative z-10
          flex h-12 w-12 items-center justify-center
          rounded-2xl
          bg-[color:var(--brand-primary)]/20
          text-[color:var(--brand-accent)]
        "
      >
        <Icon size={22} strokeWidth={1.5} />
      </div>
    </div>
  );
}
