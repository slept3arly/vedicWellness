"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/app/animations";

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
      variants={stagger}
      initial="hidden"
      animate="show"
      className={["mx-auto max-w-3xl text-center space-y-5", className].join(" ")}
    >
      {badge ? <motion.div variants={fadeUp}>{badge}</motion.div> : null}

      <motion.h1
        variants={fadeUp}
        className="font-heading text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white"
      >
        {title}
      </motion.h1>

      {subtitle ? (
        <motion.p
          variants={fadeUp}
          className="font-body text-lg text-slate-700 dark:text-slate-300"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
