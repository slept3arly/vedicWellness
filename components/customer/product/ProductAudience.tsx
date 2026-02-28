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
      <h2 className="font-heading text-xl font-extrabold mb-4 flex items-center gap-2">
        <Users size={18} />
        Who Should Use This?
      </h2>

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
              <Card className="h-full px-4 py-3 group">
                <div className="flex items-start gap-3">
                  
                  {/* Compact Icon */}
                  <div className="mt-0.5 text-muted group-hover:text-accent transition-colors duration-300">
                    <Icon size={18} strokeWidth={2.2} />
                  </div>

                  {/* Text */}
                  <p className="text-sm leading-snug font-medium">
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