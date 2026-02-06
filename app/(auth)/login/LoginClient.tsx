"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { fadeUpSoft, staggerFast } from "@/app/animations";

import GlassCard from "@/components/old_files/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import PageHeader from "@/components/ui/PageHeader";

import LoginForm from "./LoginForm";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const next =
    searchParams.get("next") ||
    searchParams.get("callbackUrl") ||
    "/products";

  const signupHref = `/signup?next=${encodeURIComponent(next)}`;

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-10">

        <PageHeader
          badge={
            <Chip className="flex items-center gap-2">
              <Sparkles size={14}/> Member Login
            </Chip>
          }
          title={<>Welcome back to <span className="text-green-600">Vedic Wellness</span></>}
          subtitle="Log in to access products and partner tools."
        />

        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-2"
        >
          {["Secure Login","Verified Partners","Fast Access","Support Available"].map(t=>(
            <motion.div variants={fadeUpSoft} key={t}>
              <Chip>{t}</Chip>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUpSoft}
          initial="hidden"
          animate="show"
          className="max-w-xl mx-auto"
        >
          <GlassCard className="p-8 dark:bg-slate-900/60">
            <h2 className="text-center text-3xl font-bold">Log In</h2>

            <p className="mt-2 text-center text-slate-600 dark:text-slate-300">
              Don’t have an account?{" "}
              <a href={signupHref} className="text-green-600 font-semibold">
                Create one
              </a>
            </p>

            <div className="mt-6">
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </section>
  );
}
