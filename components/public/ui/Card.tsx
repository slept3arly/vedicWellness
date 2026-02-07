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
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className={clsx(
        `
        relative overflow-hidden
        rounded-[var(--radius)]
        bg-[var(--bg-surface)]
        border border-[var(--border-soft)]
        shadow-[var(--shadow-soft)]
        hover:shadow-[var(--shadow-hover)]
        p-6
        `,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      {children}
    </motion.div>
  );
}
