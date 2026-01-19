"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { fadeUp } from "@/app/animations";

import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import PageHeader from "@/components/ui/PageHeader";

import SignupForm from "@/app/(auth)/signup/SignupForm";

export default function SignupClient() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        {/* HEADER */}
        <PageHeader
          badge={
            <p className="inline-flex mx-auto items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Create Account
            </p>
          }
          title={
            <>
              Join the{" "}
              <span className="text-w dark:text-green-400">Vedic Wellness</span>{" "}
              partner network.
            </>
          }
          subtitle="Create your account to view products, download catalogs, and access partner benefits."
        />

        {/* ✅ CENTERED CONTENT */}
        <div className="mt-10 flex flex-col items-center">
          {/* FORM CARD */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-xl"
          >
            <GlassCard className="p-7 md:p-9">
              <h1 className="text-center font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
                Sign Up
              </h1>

              <p className="mt-2 text-center font-body text-slate-700 dark:text-slate-300">
                Create an account to view products.
              </p>

              <div className="mt-6">
                <Suspense fallback={null}>
                  <SignupForm />
                </Suspense>
              </div>

              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                By creating an account, you agree to our terms & privacy policy.
              </p>
            </GlassCard>
          </motion.div>

          {/* ✅ CHIPS BELOW CARD (CENTERED) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-wrap justify-center gap-3"
          >
            {["Quick Signup", "Verified Portal", "Partner Benefits", "Secure Access"].map(
              (t) => (
                <Chip key={t}>{t}</Chip>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
