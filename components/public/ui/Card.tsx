"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof motion.div>;

export default function Card({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      {...props}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      layout
      style={{ willChange: "transform" }}
      className={cn(
        "relative overflow-hidden",
        "rounded-[var(--radius)]",
        "bg-[var(--bg-surface)]",
        "border border-[var(--border-soft)]",
        "shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)]",
        "p-6",
        className
      )}
    >
      {/* gradient overlay — SAME AS BEFORE */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />

      {/* actual content */}
      {children}
    </motion.div>
  );
}
