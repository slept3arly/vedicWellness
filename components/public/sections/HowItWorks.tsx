"use client";

import { motion } from "framer-motion";
import {
  fadeUp,
  staggerFast,
  cardInteraction,
} from "@/app/animations";

import Card from "@/components/public/ui/Card";

/* ---------------- DATA ---------------- */

const steps = [
  {
    title: "Apply for Franchise",
    desc: "Share your city or district along with basic business details to get started.",
  },
  {
    title: "Receive Catalog & Scheme",
    desc: "Get access to the complete product catalog, pricing, and distributor schemes.",
  },
  {
    title: "Confirm Monopoly Rights",
    desc: "Finalize your exclusive area and complete onboarding with our team.",
  },
  {
    title: "Start Selling & Grow",
    desc: "Begin distribution immediately with marketing and operational support.",
  },
];

export default function HowItWorks() {
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
            How It Works
          </h2>
          <p className="mt-2 text-base md:text-lg text-muted">
            A simple, transparent onboarding process designed for fast franchise activation.
          </p>
        </motion.header>

        {/* Steps */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={fadeUp} className="group">
              <motion.div
                variants={cardInteraction}
                initial="rest"
                whileHover="hover"
              >
                <Card
                  className="
                    relative h-full
                    bg-white/70 dark:bg-black/45
                     
                    transition-shadow duration-300
                    group-hover:shadow-[0_18px_45px_rgba(2,101,54,0.25)]
                  "
                >
                  {/* Vertical accent */}
                  <div
                    className="
                      absolute left-0 top-0 bottom-0
                      w-1 rounded-l-2xl
                      bg-[color:var(--brand-primary)]/25
                    "
                  />

                  <div className="pl-6 space-y-3">
                    <span className="text-sm font-semibold text-[color:var(--brand-accent)]">
                      Step {index + 1}
                    </span>

                    <h3 className="text-lg font-semibold">
                      {step.title}
                    </h3>

                    <p className="text-sm text-muted leading-relaxed">
                      {step.desc}
                    </p>
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
