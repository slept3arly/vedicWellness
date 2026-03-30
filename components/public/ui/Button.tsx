"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  MotionProps & {
    variant?: "primary" | "secondary" | "ghost";
    isLoading?: boolean;
    autoLoading?: boolean;
    iconOnly?: boolean;
  };

export default function Button({
  children,
  variant = "primary",
  className,
  isLoading = false,
  autoLoading = false,
  iconOnly = false,
  disabled,
  ...props
}: ButtonProps) {
  // Always call — Rules of Hooks
  const { pending } = useFormStatus();
  const loading = isLoading || (autoLoading && pending);

  return (
    <motion.button
      whileTap={!loading ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      disabled={loading || disabled}
      aria-busy={loading}
      className={cn(
        // ── Base layout
        "relative inline-flex items-center justify-center",
        "h-10 min-w-[100px] sm:min-w-[140px] px-5",
        "rounded-md",
        "text-[13px] font-semibold tracking-wide uppercase",
        "whitespace-nowrap select-none",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-[#84eb4b]/60",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "overflow-hidden",

        iconOnly && "min-w-[40px] px-0",

        // ── PRIMARY: solid brand green
        // Light: #039751 bg, white text → hover slightly darker
        // Dark:  #84eb4b bg, very dark text → hover slightly dimmer
        variant === "primary" && [
          "bg-[#039751] text-white shadow-sm",
          "hover:bg-[#027d44] hover:shadow-md",
          "dark:bg-[#84eb4b] dark:text-[#0a1a07]",
          "dark:hover:bg-[#76d441] dark:shadow-none",
        ],

        // ── SECONDARY: solid light bg with brand border + text
        // Light: white bg, brand green text + border
        // Dark:  neutral dark bg, white text, subtle grey border — simple & clean
        variant === "secondary" && [
          "bg-white text-[#039751] border border-[#039751]/50 shadow-sm",
          "hover:bg-[#f0fdf4] hover:border-[#039751]",
          "dark:bg-[#1a1a1a] dark:text-white dark:border-white/10",
          "dark:hover:bg-[#242424] dark:hover:border-white/20",
        ],

        // ── GHOST: no bg, no border — just tinted text
        variant === "ghost" && [
          "bg-transparent text-[#039751]",
          "hover:bg-[#039751]/8 hover:text-[#027d44]",
          "dark:text-white/70 dark:hover:bg-white/8 dark:hover:text-white",
        ],

        loading && "cursor-wait",
        className
      )}
      {...props}
    >
      {/* Stable content wrapper — no transform applied to prevent text shifting */}
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
        {children}
      </span>

      {/* Spinner — absolutely centered, never displaces layout */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <span
            className={cn(
              "h-[14px] w-[14px] animate-spin rounded-full border-[1.5px]",
              variant === "primary"
                ? "border-white/30 border-t-white dark:border-[#0a1a07]/30 dark:border-t-[#0a1a07]"
                : "border-current/30 border-t-current"
            )}
          />
        </span>
      )}
    </motion.button>
  );
}