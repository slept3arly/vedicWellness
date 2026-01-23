"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, BadgeCheck } from "lucide-react";
import { useSearchParams } from "next/navigation"; // ✅ ADD

import { fadeUp } from "@/app/animations";

import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import PageHeader from "@/components/ui/PageHeader";

import LoginForm from "./LoginForm";

export default function LoginClient() {
  const searchParams = useSearchParams(); // ✅ ADD
  const next =
    searchParams.get("next") ||
    searchParams.get("callbackUrl") ||
    "/products";

  const signupHref = `/signup?next=${encodeURIComponent(next)}`; // ✅ ADD

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

        {/* TRUST CHIPS */}
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
                  href={signupHref} // ✅ UPDATED
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
          {/* ... your existing benefits untouched ... */}
        </div>
      </div>
    </section>
  );
}
