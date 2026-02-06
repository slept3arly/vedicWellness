"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { fadeUpSoft, staggerFast } from "@/app/animations";

import GlassCard from "@/components/old_files/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import PageHeader from "@/components/ui/PageHeader";

import SignupForm from "./SignupForm";

export default function SignupClient() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-10">

        <PageHeader
          badge={
            <Chip className="flex items-center gap-2">
              <Sparkles size={14}/> Create Account
            </Chip>
          }
          title={<>Join <span className="text-green-600">Vedic Wellness</span></>}
          subtitle="Access catalogs, products and franchise benefits."
        />

        <motion.div
          variants={fadeUpSoft}
          initial="hidden"
          animate="show"
          className="max-w-xl mx-auto"
        >
          <GlassCard className="p-8 dark:bg-slate-900/60">
            <Suspense fallback={null}>
              <SignupForm />
            </Suspense>
          </GlassCard>
        </motion.div>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-2"
        >
          {["Quick Signup","Verified Portal","Partner Benefits","Secure Access"].map(t=>(
            <motion.div variants={fadeUpSoft} key={t}>
              <Chip>{t}</Chip>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
