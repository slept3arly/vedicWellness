"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { fadeUpSoft, staggerFast } from "@/app/animations";

import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";
import PageHeader from "@/components/public/PageHeader";

import SignupForm from "./SignupForm";

export default function SignupClient() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-12">

        {/* HEADER */}
        <PageHeader
          badge={
            <Chip className="flex items-center gap-2">
              <Sparkles size={14} />
              Create Account
            </Chip>
          }
          title={
            <>
              Join{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                Vedic Wellness
              </span>
            </>
          }
          subtitle="Create your account to access catalogs, products, and exclusive franchise benefits."
        />

        {/* TRUST CHIPS */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-2"
        >
          {[
            "Quick Signup",
            "Verified Portal",
            "Partner Benefits",
            "Secure Access",
          ].map((t) => (
            <motion.div key={t} variants={fadeUpSoft}>
              <Chip>{t}</Chip>
            </motion.div>
          ))}
        </motion.div>

        {/* SIGNUP CARD */}
        <motion.div
          variants={fadeUpSoft}
          initial="hidden"
          animate="show"
          className="max-w-xl mx-auto"
        >
          <Card
            className="
              p-8 md:p-10
              bg-white/75 dark:bg-black/45
               
              shadow-[0_24px_60px_rgba(2,101,54,0.25)]
            "
          >
            <h2 className="text-center text-3xl font-extrabold">
              Create your account
            </h2>

            <p className="mt-2 text-center text-sm text-muted">
              It takes less than a minute to get started.
            </p>

            <div className="mt-6">
              <Suspense fallback={null}>
                <SignupForm />
              </Suspense>
            </div>

            <p className="mt-6 text-center text-xs text-muted">
              By signing up, you agree to our terms & privacy policy.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
