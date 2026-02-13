"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

type ButtonProps =
  React.ComponentPropsWithoutRef<"button"> &
  MotionProps & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";

    /* NEW */
    isLoading?: boolean;
    loadingText?: string;
    autoLoading?: boolean; // detect form status automatically
  };

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  isLoading = false,
  loadingText,
  autoLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const form = autoLoading ? useFormStatus() : null;
  const loading = isLoading || (form?.pending ?? false);

  return (
    <motion.button
      whileHover={!loading ? { y: -2, scale: 1.04 } : undefined}
      whileTap={!loading ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ willChange: "transform" }}
      disabled={loading || disabled}
      aria-busy={loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-[14px] font-medium",
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

        loading && "opacity-80 cursor-wait",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingText ?? children}</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
      aria-hidden
    />
  );
}
