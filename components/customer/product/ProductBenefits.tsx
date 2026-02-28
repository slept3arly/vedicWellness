"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Leaf,
  ShieldCheck,
  HeartPulse,
  Zap,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import { fadeUpSoft, staggerSlow } from "@/app/animations";

const icons = [Leaf, ShieldCheck, HeartPulse, Zap];

export default function ProductBenefits({
  benefits,
}: {
  benefits: string[];
}) {
  if (!benefits.length) return null;

  return (
    <section className="mt-12">
      <h2 className="font-heading text-xl font-extrabold mb-4 flex items-center gap-2">
        <Sparkles size={18} />
        Key Benefits
      </h2>

      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {benefits.slice(0, 4).map((b, i) => {
          const Icon = icons[i % icons.length];

          return (
            <motion.div
              key={i}
              variants={fadeUpSoft}
              className={i === 3 ? "lg:hidden" : ""}
            >
              <Card className="h-full px-4 py-3 group">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted group-hover:text-accent transition-colors duration-300">
                    <Icon size={18} strokeWidth={2.2} />
                  </div>

                  <p className="text-sm leading-snug font-medium">
                    {b}
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