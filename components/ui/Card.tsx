"use client";

import clsx from "clsx";
import { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={clsx(
        `
        relative overflow-hidden rounded-[18px] p-6
        bg-[var(--bg-surface)]
        border border-[var(--border-soft)]
        shadow-[0_10px_28px_rgba(0,0,0,0.08)]
        dark:shadow-[0_14px_40px_rgba(0,0,0,0.7)]
        transition-all
        hover:shadow-[0_18px_50px_rgba(0,0,0,0.14)]
        `,
        className
      )}
    >
      {/* soft light highlight */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />

      {children}
    </motion.div>
  );
}
