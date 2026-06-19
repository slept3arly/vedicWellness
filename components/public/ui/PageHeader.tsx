"use client";

import React from "react";
import { motion } from "framer-motion";
import { staggerFast, reveal } from "@/app/animations";
import { cn } from "@/lib/cn";

type Props = {
  badge?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
};

export default function PageHeader({
  badge,
  title,
  subtitle,
  align = "center",
  className,
}: Props) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={cn("max-w-5xl space-y-4", alignment, className)}
    >
      {badge && (
        <motion.div variants={reveal} className="flex justify-center">
          {badge}
        </motion.div>
      )}

      <motion.h1
        variants={reveal}
        className="
          font-display
          text-4xl sm:text-5xl lg:text-6xl
          font-semibold tracking-tight
          leading-tight
          text-slate-900 dark:text-white
        "
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          variants={reveal}
          className="
            font-body
            text-base sm:text-lg
            text-slate-600 dark:text-slate-300
            leading-relaxed
          "
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}