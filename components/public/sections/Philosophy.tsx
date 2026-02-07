"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  Microscope,
  HeartPulse,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  fadeUpSoft,
  staggerFast,
  scaleIn,
  zLiftIcon,
  zLiftSpring,
} from "@/app/animations";

/* ---------------- DATA ---------------- */

const cards = [
  {
    icon: Leaf,
    badge: "PCD Pharma Franchise Advantage",
    title: "Authentic Ayurvedic Formulations",
    desc: "Time-tested Ayurvedic formulations designed for consistent therapeutic outcomes and strong doctor acceptance.",
    bullets: [
      "Classical & proprietary formulations",
      "High repeat prescription rate",
      "Consumer-trusted ingredients",
    ],
  },
  {
    icon: Microscope,
    badge: "GMP & Regulatory Compliance",
    title: "Modern Pharma Manufacturing",
    desc: "Manufactured in GMP-certified facilities with strict quality control, documentation, and batch-level testing.",
    bullets: [
      "WHO-GMP certified units",
      "Batch-wise quality checks",
      "Regulatory documentation support",
    ],
  },
  {
    icon: Shield,
    badge: "Low Risk Business Model",
    title: "Safe & Reliable Product Portfolio",
    desc: "A carefully curated range focused on safety, purity, and long-term market credibility for franchise partners.",
    bullets: [
      "Stable formulations",
      "Minimal market complaints",
      "Long shelf life",
    ],
  },
  {
    icon: HeartPulse,
    badge: "High Demand Wellness Segments",
    title: "Wellness-Driven Product Range",
    desc: "Products aligned with high-demand categories like immunity, digestion, liver care, and lifestyle wellness.",
    bullets: [
      "Fast-moving SKUs",
      "Doctor & consumer demand",
      "Strong repeat sales",
    ],
  },
  {
    icon: TrendingUp,
    badge: "Scalable PCD Growth Opportunity",
    title: "High Margins & Monopoly Rights",
    desc: "A structured PCD pharma franchise model offering monopoly rights, attractive margins, and marketing support.",
    bullets: [
      "Monopoly territory rights",
      "High profit margins",
      "Promotional & visual aids",
    ],
  },
];

export default function Philosophy() {
  const router = useRouter();
  const total = cards.length;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-10"
      >
        {/* ================= HEADING (ALL SCREENS) ================= */}
        <motion.div variants={fadeUpSoft}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Our Philosophy
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
            Ancient Ayurvedic wisdom combined with modern pharmaceutical
            standards to build a profitable and sustainable PCD pharma franchise.
          </p>
        </motion.div>

        {/* ================= MOBILE: INFORMATIVE STACK ================= */}
        <div className="md:hidden">
          <div
            className="relative"
            style={{ minHeight: `${total * 48}vh` }}
          >
            {cards.map((card, index) => {
              const scale = 0.94 + (index / (total - 1)) * 0.12;

              return (
                <motion.div
                  key={card.title}
                  variants={scaleIn}
                  initial="rest"
                  animate="rest"
                  whileTap={{ scale: scale - 0.03 }}
                  onClick={() => router.push("/blogs")}
                  className="
                    sticky
                    top-32
                    mx-auto
                    w-[92%]
                    max-w-sm
                    h-[65vh]
                    cursor-pointer
                    rounded-3xl
                    bg-white dark:bg-slate-900
                    p-6
                  "
                  style={{
                    zIndex: index + 1,
                    transform: `
                      translateY(${index * 16}px)
                      scale(${scale})
                    `,
                    boxShadow: "0 22px 55px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* Badge */}
                  <p className="text-[11px] font-semibold tracking-wider text-green-700 dark:text-green-300 uppercase">
                    {card.badge}
                  </p>

                  {/* Icon */}
                  <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 text-green-700 dark:text-green-300">
                    <card.icon size={26} />
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>

                  {/* Divider */}
                  <div className="my-4 h-px bg-slate-200 dark:bg-slate-700" />

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {card.desc}
                  </p>

                  {/* Bullets */}
                  <ul className="mt-4 space-y-1 text-sm text-slate-700 dark:text-slate-400">
                    {card.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <p className="mt-6 text-sm font-semibold text-green-700 dark:text-green-300">
                    Learn more →
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================= DESKTOP: CLEAN & SIMPLE ================= */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={scaleIn}
                initial="rest"
                animate="rest"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="
                  group
                  rounded-3xl
                  bg-white/70 dark:bg-slate-900/60
                  p-6
                  shadow-sm
                  hover:shadow-lg
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
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- ICON BLOCK ---------------- */

function IconBlock({ Icon }: any) {
  return (
    <motion.div
      variants={zLiftIcon}
      transition={zLiftSpring}
      className="relative mb-4 w-fit"
    >
      <div className="absolute inset-0 rounded-2xl bg-green-500/25 blur-2xl opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110" />
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600/10 text-green-700 dark:text-green-300 shadow-sm">
        <Icon size={22} />
      </div>
    </motion.div>
  );
}
