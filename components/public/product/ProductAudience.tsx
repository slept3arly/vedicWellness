"use client";

import { motion } from "framer-motion";
import {
  Users,
  Heart,
  UserCheck,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { fadeUpSoft, staggerSlow } from "@/app/animations";

const icons = [Heart, UserCheck, ShieldCheck, Stethoscope];

export default function ProductAudience({
  whoShouldUse,
}: {
  whoShouldUse: string[];
}) {
  if (!whoShouldUse.length) return null;

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/10 text-[color:var(--brand-accent)]">
          <Users size={22} />
        </div>
        <SectionHeading title="Who Should Use This?" />
      </div>

      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {whoShouldUse.slice(0, 4).map((w, i) => {
          const Icon = icons[i % icons.length];

          return (
            <motion.div
              key={i}
              variants={fadeUpSoft}
              className={i === 3 ? "lg:hidden" : ""}
            >
              <Card className="group h-full bg-white/50 px-4 py-4 transition-all hover:shadow-md dark:bg-black/20">
                <div className="flex items-start gap-3">
                  {/* Compact Icon */}
                  <div className="mt-0.5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-[color:var(--brand-accent)]">
                    <Icon size={20} strokeWidth={2.5} />
                  </div>

                  {/* Text */}
                  <p className="font-medium text-sm leading-snug text-slate-700 transition-colors group-hover:text-foreground dark:text-slate-200 md:text-base">
                    {w}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}