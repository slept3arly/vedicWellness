"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type ButtonProps =
  React.ComponentPropsWithoutRef<"button"> &
  MotionProps & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
  };

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ willChange: "transform" }}
      className={cn(
        "relative inline-flex items-center justify-center rounded-[14px] font-medium",
        "transition-shadow focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--brand-primary)_35%,transparent)]",

        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-3 text-sm",
        size === "lg" && "px-8 py-4 text-base",

        variant === "primary" &&
          "text-white bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-accent))] shadow-lg hover:shadow-xl",

        variant === "secondary" &&
          "bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-soft)] shadow-sm hover:shadow-lg",

        variant === "ghost" &&
          "bg-transparent text-[var(--text-main)] hover:bg-[var(--bg-surface)]",

        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
