"use client";

import { motion } from "framer-motion";
import { Banknote, CheckCircle2 } from "lucide-react";
import { fadeUp, stagger } from "@/app/animations";

import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function FranchiseBenefits() {
  const benefits = [
    "District / City Monopoly Rights",
    "High Profit Margins",
    "Low Investment PCD Model",
    "Regular Stock Availability",
    "Promotional Material Support",
    "New Launch Updates & Schemes",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* LEFT */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          <SectionHeading
            title="Franchise Benefits"
            subtitle="We help you scale with monopoly rights, consistent supply, and strong support — so you can focus on sales and expansion."
            align="left"
          />

          <motion.ul variants={stagger} className="space-y-3">
            {benefits.map((b) => (
              <motion.li
                key={b}
                variants={fadeUp}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/60 p-4   dark:border-slate-800 dark:bg-slate-900/40"
              >
                <CheckCircle2
                  className="mt-0.5 text-green-600 dark:text-green-400"
                  size={20}
                />
                <span className="font-body text-slate-700 dark:text-slate-200">
                  {b}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <GlassCard className="p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                <Banknote size={22} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Franchise Opportunity
                </p>
                <p className="font-heading text-xl font-extrabold text-slate-900 dark:text-white">
                  Grow with a trusted Ayurvedic brand
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  ✅ Marketing Support
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Visual aids, banners & product literature.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  ✅ Reliable Supply
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Fast dispatch + consistent stock availability.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <a href="/contact" className="block">
                <Button className="w-full" variant="primary">
                  Get Franchise Details
                </Button>
              </a>
            </div>

            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
              Response time: typically within 24 hours
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
