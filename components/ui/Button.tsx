"use client";

import { motion, MotionProps } from "framer-motion";
import clsx from "clsx";
import React from "react";

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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={clsx(
        "relative overflow-hidden rounded-[14px] font-medium transition-all focus:outline-none",

        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-3 text-sm",
        size === "lg" && "px-8 py-4 text-base",

        variant === "primary" &&
          `
          text-white
          bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-accent))]
          shadow-lg shadow-green-900/20
          hover:shadow-xl hover:shadow-green-900/30
          `,

        variant === "secondary" &&
          `
          bg-[var(--bg-surface)]
          text-[var(--text-main)]
          border border-[var(--border-soft)]
          hover:border-green-500/40
          hover:shadow-md
          `,

        variant === "ghost" &&
          `
          bg-transparent
          text-[var(--text-main)]
          hover:bg-[var(--bg-surface)]
          `,

        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
