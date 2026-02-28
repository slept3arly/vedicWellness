"use client";

import React from "react";
import { motion } from "framer-motion";
import { staggerFast, reveal } from "@/app/animations";

type Props = {
  badge?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
};

export default function PageHeader({
  badge,
  title,
  subtitle,
  className = "",
}: Props) {
  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={`mx-auto max-w-3xl text-center space-y-3 ${className}`}
    >
      {badge && (
        <motion.div variants={reveal} className="flex justify-center">
          {badge}
        </motion.div>
      )}

      <motion.h1
        variants={reveal}
        className="
          text-4xl sm:text-5xl 
          font-extrabold leading-tight
          text-slate-900 dark:text-white
        "
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          variants={reveal}
          className="
            text-base sm:text-lg 
            text-slate-600 dark:text-slate-300
          "
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
