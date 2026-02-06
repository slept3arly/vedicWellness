"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { fadeUpSoft, scaleIn } from "@/app/animations";

export default function CTABanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      <motion.div
        variants={scaleIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="
          relative overflow-hidden
          rounded-3xl
          bg-white/70 dark:bg-slate-900/60
          border border-green-600/15
          p-10 md:p-12
          shadow-lg
        "
      >
        {/* soft light sweep */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30 animate-[pulse_4s_ease-in-out_infinite]" />

        <motion.div variants={fadeUpSoft} className="space-y-2 max-w-2xl">

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Ready to Start Your PCD Franchise?
          </h2>

          <p className="text-slate-600 dark:text-slate-300">
            Get product list, current schemes, monopoly availability and onboarding
            guidance from our team — quick and hassle-free.
          </p>

        </motion.div>

        <motion.div
          variants={fadeUpSoft}
          className="mt-6 flex flex-wrap gap-4"
        >
          <a
            href="tel:+919306025799"
            className="
              flex items-center gap-2
              rounded-xl
              bg-green-600
              px-6 py-3
              font-medium
              text-white
              shadow-md
              transition hover:brightness-110
            "
          >
            <Phone size={18} />
            Call Now
          </a>

          <a
            href="https://wa.me/919306025799"
            target="_blank"
            className="
              flex items-center gap-2
              rounded-xl
              border border-green-600/30
              bg-green-600/10
              px-6 py-3
              font-medium
              text-green-700 dark:text-green-300
              transition hover:bg-green-600/20
            "
          >
            <MessageCircle size={18} />
            WhatsApp Us
          </a>
        </motion.div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Average response time: within 24 hours
        </p>

      </motion.div>
    </section>
  );
}
