"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, BadgeCheck } from "lucide-react";

import { fadeUp } from "@/app/animations";

import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import PageHeader from "@/components/ui/PageHeader";

import LoginForm from "./LoginForm";

export default function LoginClient() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        {/* PAGE HEADER */}
        <PageHeader
          badge={
            <p className="inline-flex mx-auto items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Member Login
            </p>
          }
          title={
            <>
              Welcome back to{" "}
              <span className="text-w dark:text-green-400">Vedic Wellness</span>.
            </>
          }
          subtitle="Log in to view products, access your dashboard, and manage your account."
        />

        {/* ✅ TRUST CHIPS (OUTSIDE GRID) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {["Secure Login", "Verified Partners", "Fast Access", "Support Available"].map(
            (t) => (
              <Chip key={t}>{t}</Chip>
            )
          )}
        </motion.div>

        {/* ✅ GRID ONLY HAS 2 ITEMS */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <GlassCard className="p-7 md:p-9">
              <h1 className="text-center font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
                Log In
              </h1>

              <p className="mt-2 text-center font-body text-slate-700 dark:text-slate-300">
                Log in to view products and manage your account.
              </p>

              <div className="mt-3 text-center text-sm text-slate-700 dark:text-slate-300">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="font-semibold text-green-700 hover:text-green-600 dark:text-green-300"
                >
                  Create one
                </a>
              </div>

              <div className="mt-6">
                <Suspense fallback={null}>
                  <LoginForm />
                </Suspense>
              </div>

              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                By logging in, you agree to our terms & privacy policy.
              </p>
            </GlassCard>
          </motion.div>

          {/* BENEFITS */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="order-last lg:order-none"
          >
            <div className="space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Secure Access",
                  desc: "Protected login with secure authentication.",
                },
                {
                  icon: BadgeCheck,
                  title: "Verified Partner Portal",
                  desc: "Access catalog & partner resources after login.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                      <item.icon size={22} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="font-body text-sm text-slate-600 dark:text-slate-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-green-600/25 bg-green-500/10 p-6">
              <h3 className="font-heading text-lg font-extrabold text-slate-900 dark:text-white">
                Need Help?
              </h3>
              <p className="mt-2 font-body text-sm text-slate-700 dark:text-slate-300">
                Facing login issues? Contact support on WhatsApp.
              </p>

              <a
                href="https://wa.me/+919306025799"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full border border-green-600/30 bg-white/60 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-white dark:bg-slate-950/40 dark:text-green-200"
              >
                WhatsApp Support
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
