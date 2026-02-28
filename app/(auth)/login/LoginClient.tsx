"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { fadeUpSoft, staggerFast } from "@/app/animations";

import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";
import PageHeader from "@/components/public/layout/PageHeader";

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

        {/* Header */}
        <PageHeader
          badge={
            <Chip className="flex items-center gap-2">
              <Sparkles size={14} />
              Member Login
            </Chip>
          }
          title={
            <>
              Welcome back to{" "}
              <span className="text-[color:var(--brand-accent)]">
                Vedic Wellness
              </span>
            </>
          }
          subtitle="Log in to access products and partner tools."
        />

        {/* Trust chips */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-2"
        >
          {["Secure Login", "Verified Partners", "Fast Access", "Support Available"].map(
            (t) => (
              <motion.div key={t} variants={fadeUpSoft}>
                <Chip>{t}</Chip>
              </motion.div>
            )
          )}
        </motion.div>

        {/* Form */}
        <motion.div
          variants={fadeUpSoft}
          initial="hidden"
          animate="show"
          className="max-w-xl mx-auto"
        >
          <Card className="bg-white/80 dark:bg-black/45">
            <h2 className="text-center text-3xl font-extrabold">
              Log In
            </h2>

            <p className="mt-2 text-center text-sm text-muted">
              Don’t have an account?{" "}
              <a
                href={signupHref}
                className="font-semibold text-[color:var(--brand-accent)] hover:underline"
              >
                Create one
              </a>
            </p>

            <div className="mt-6">
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </div>
          </Card>
        </motion.div>

      </div>
    </section>
  );
}
