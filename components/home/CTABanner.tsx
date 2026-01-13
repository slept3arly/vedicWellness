"use client";

import { motion } from "framer-motion";
import { MessagesSquare } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="rounded-3xl bg-gradient-to-r from-green-600 to-green-500 p-8 text-white shadow-xl"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl font-extrabold">
              Ready to start your PCD franchise journey?
            </h2>
            <p className="font-body text-white/90">
              Get product list, latest schemes, and monopoly availability details
              within 24 hours.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a
              href="#apply"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 font-semibold text-green-700 shadow-sm transition hover:bg-white/90"
            >
              Apply Now
            </a>

            <a
              href="https://wa.me/917206867795"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              <MessagesSquare size={16} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
