"use client";

import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Truck, PhoneCall, MessagesSquare, Sparkles } from "lucide-react";
import { fadeUp, stagger } from "./animations";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-8 pb-12 lg:pt-16 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={fadeUp}>
              <p className="inline-flex items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
                <Sparkles size={16} />
                PCD Pharma Franchise • Ayurvedic Range
              </p>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-5xl"
            >
              Grow your pharma business with{" "}
              <span className="text-w dark:text-green-400">Vedic Wellness</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-xl font-body text-lg text-slate-700 dark:text-slate-300">
              Vedic Wellness (A Division of Innovia Drugs) offers a strong Ayurvedic portfolio for PCD partners — monopoly
              rights, marketing support, fast dispatch and high-demand products.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#apply"
                className="inline-flex items-center justify-center rounded-2xl bg-[#039751] px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
              >
                Apply for Franchise
              </a>

              <div className="flex gap-3">
                <a
                  href="tel:+910000000000"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white hover:text-black dark:border-slate-800 dark:bg-slate-900/40 dark:text-white"
                >
                  <PhoneCall size={18} />
                  Call
                </a>
                <a
                  href="https://wa.me/910000000000"
                  target="_blank"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-green-600/25 bg-green-500/10 px-5 py-3 font-semibold text-green-800 shadow-sm transition hover:bg-green-500/15 dark:text-green-200"
                >
                  <MessagesSquare size={18} />
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* MICRO TRUST */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {["ISO Certified", "District Monopoly", "High Profit Margin", "Fast Dispatch", "Promotional Support"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-slate-200 bg-white/60 px-4 py-2 text-sm text-slate-700 backdrop-blur dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
                  >
                    {t}
                  </span>
                )
              )}
            </motion.div>

            <motion.p variants={fadeUp} className="font-quote text-lg italic text-slate-700 dark:text-slate-300">
              Innovating Ayurveda, Preserving Tradition
            </motion.p>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
              <div className="grid gap-4">
                <HeroCard
                  icon={BadgeCheck}
                  title="WHO-GMP Quality Products"
                  desc="Manufacturing & quality standards designed for consistent performance."
                />
                <HeroCard
                  icon={MapPin}
                  title="Monopoly Rights Available"
                  desc="Exclusive franchise rights for your city/district to ensure growth."
                />
                <HeroCard
                  icon={Truck}
                  title="Fast Dispatch & Supply"
                  desc="Reliable stock availability with quick dispatch support."
                />
              </div>

              <div id="apply" className="mt-6 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 p-5 text-white">
                <p className="text-sm opacity-90">Limited openings available</p>
                <p className="mt-1 text-xl font-extrabold">Get Product List + Franchise Offer</p>
                <p className="mt-1 text-sm opacity-90">Receive the latest schemes & product catalog within 24 hours.</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/15 px-4 py-3 text-sm">✅ Marketing Kit</div>
                  <div className="rounded-xl bg-white/15 px-4 py-3 text-sm">✅ Visual Aids Support</div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -top-4 -right-4 hidden rounded-2xl border border-green-600/25 bg-white/70 px-4 py-3 text-sm font-semibold text-green-800 shadow-lg backdrop-blur dark:bg-slate-900/40 dark:text-green-200 lg:block">
              Trusted Ayurvedic Franchise
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
          <Icon size={22} />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="font-body text-sm text-slate-600 dark:text-slate-300">{desc}</p>
        </div>
      </div>
    </div>
  );
}
