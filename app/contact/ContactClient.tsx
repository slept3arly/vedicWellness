"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  PhoneCall,
  MessagesSquare,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

import { fadeUp, stagger } from "../animations";

// UI Components
import PageHeader from "@/components/ui/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        {/* PAGE HEADER */}
        <PageHeader
          badge={
            <p className="inline-flex mx-auto items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Contact • Franchise Enquiry
            </p>
          }
          title={
            <>
              Let’s connect with{" "}
              <span className="text-w dark:text-green-400">Vedic Wellness</span>
            </>
          }
          subtitle="Need product list, franchise offer, or distributor support? Contact us using the options below."
        />

        {/* QUICK TRUST CHIPS */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap justify-center gap-5"
        >
          {["Fast Response", "Monopoly Rights", "PAN India Supply", "Marketing Support"].map(
            (t) => (
              <motion.div key={t} variants={fadeUp}>
                <Chip>{t}</Chip>
              </motion.div>
            )
          )}
        </motion.div>

        {/* MAIN GRID */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* LEFT — CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <GlassCard className="p-6 md:p-8">
              <SectionHeading
                align="left"
                title="Send us an enquiry"
                subtitle="Fill the form and we’ll send product list + franchise offer within 24 hours."
              />

              <form className="mt-6 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 outline-none backdrop-blur transition focus:border-green-600/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 outline-none backdrop-blur transition focus:border-green-600/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 outline-none backdrop-blur transition focus:border-green-600/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      City / District
                    </label>
                    <input
                      type="text"
                      placeholder="Enter location"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 outline-none backdrop-blur transition focus:border-green-600/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us what you need (product list / franchise offer / MOQ / area monopoly)..."
                    rows={5}
                    className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 outline-none backdrop-blur transition focus:border-green-600/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button type="submit" variant="primary" className="flex-1">
                    Submit Enquiry
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={() =>
                      window.open("https://wa.me/910000000000", "_blank")
                    }
                  >
                    WhatsApp Instead
                  </Button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  *We usually respond within a few hours during working time.
                </p>
              </form>
            </GlassCard>
          </motion.div>

          {/* RIGHT — QUICK CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="space-y-6"
          >
            <GlassCard className="p-6 md:p-8">
              <SectionHeading
                align="left"
                title="Quick Contact"
                subtitle="Choose the easiest way to reach us."
              />

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                      <PhoneCall size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-slate-900 dark:text-white">
                        Call Us
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        +91 00000 00000
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => (window.location.href = "tel:+910000000000")}
                    >
                      Call
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-green-600/25 bg-green-500/10 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/20 p-3 text-green-800">
                      <MessagesSquare size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-slate-900">
                        WhatsApp
                      </p>
                      <p className="text-sm text-slate-700">
                        Get product list instantly
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() =>
                        window.open("https://wa.me/910000000000", "_blank")
                      }
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                      <Mail size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-slate-900 dark:text-white">
                        Email
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        support@vedicwellness.in
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* OFFICE INFO */}
            <GlassCard className="p-6 md:p-8">
              <SectionHeading
                align="left"
                title="Office & Availability"
                subtitle="Working hours and business information."
              />

              <div className="mt-6 grid gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-slate-900 dark:text-white">
                      Address
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Chandigarh, India (Innovia Drugs)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                    <Clock size={22} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-slate-900 dark:text-white">
                      Working Hours
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Mon – Sat: 10:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
