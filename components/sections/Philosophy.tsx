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

const primary = [
  {
    icon: Leaf,
    title: "Authentic Ayurvedic Formulations",
    desc: "Time-tested Ayurvedic formulations designed for consistent therapeutic outcomes and strong doctor acceptance.",
  },
  {
    icon: Microscope,
    title: "Modern Pharma Manufacturing",
    desc: "Manufactured in GMP-certified facilities with strict quality control, documentation, and batch-level testing.",
  },
];

const secondary = [
  {
    icon: Shield,
    title: "Safe & Reliable Portfolio",
    desc: "Stable, well-tested formulations ensuring long-term market trust and minimal complaints.",
  },
  {
    icon: HeartPulse,
    title: "Wellness-Focused Range",
    desc: "High-demand wellness segments like immunity, digestion, and lifestyle care.",
  },
  {
    icon: TrendingUp,
    title: "High Margin PCD Model",
    desc: "Monopoly rights, attractive margins, and full marketing support for franchise partners.",
  },
];

const mobileCards = [
  ...primary,
  ...secondary,
];

export default function Philosophy() {
  const router = useRouter();
  const total = mobileCards.length;

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

        {/* ================= MOBILE STACK ================= */}
        <div className="md:hidden">
          <div
            className="relative"
            style={{ minHeight: `${total * 48}vh` }}
          >
            {mobileCards.map(({ icon: Icon, title, desc }, index) => {
              const scale = 0.94 + (index / (total - 1)) * 0.12;

              return (
                <motion.div
                  key={title}
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
                    h-[62vh]
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
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 text-green-700 dark:text-green-300">
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    {title}
                  </h3>

                  <div className="my-4 h-px bg-slate-200 dark:bg-slate-700" />

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {desc}
                  </p>

                  <p className="mt-6 text-sm font-semibold text-green-700 dark:text-green-300">
                    Learn more →
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:block space-y-6">
          {/* Primary */}
          <div className="grid md:grid-cols-2 gap-6">
            {primary.map(({ icon: Icon, title, desc }) => (
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
                  p-7
                  shadow-sm
                  hover:shadow-lg
                "
              >
                <IconBlock Icon={Icon} />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Secondary */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {secondary.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={scaleIn}
                initial="rest"
                animate="rest"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="
                  group
                  rounded-2xl
                  bg-white/70 dark:bg-slate-900/60
                  p-6
                  shadow-sm
                  hover:shadow-lg
                "
              >
                <IconBlock Icon={Icon} small />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
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

function IconBlock({ Icon, small }: any) {
  return (
    <motion.div
      variants={zLiftIcon}
      transition={zLiftSpring}
      className="relative mb-4 w-fit"
    >
      <div className="absolute inset-0 rounded-2xl bg-green-500/25 blur-2xl opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110" />
      <div
        className={`
          relative z-10 flex items-center justify-center
          ${small ? "h-10 w-10" : "h-14 w-14"}
          rounded-2xl bg-green-600/10 text-green-700 dark:text-green-300 shadow-sm
        `}
      >
        <Icon size={small ? 20 : 26} />
      </div>
    </motion.div>
  );
}
