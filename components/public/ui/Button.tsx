"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
  autoLoading?: boolean;
  iconOnly?: boolean;
};

// Extracted variant styles for maintainability
const VARIANT_STYLES: Record<ButtonVariant, string[]> = {
  primary: [
    "bg-[#039751] text-white shadow-sm",
    "hover:bg-[#027d44] hover:shadow-md",
    "dark:bg-[#84eb4b] dark:text-[#0a1a07]",
    "dark:hover:bg-[#76d441] dark:shadow-none",
  ],
  secondary: [
    "bg-white text-[#039751] border border-[#039751]/50 shadow-sm",
    "hover:bg-[#f0fdf4] hover:border-[#039751]",
    "dark:bg-[#1a1a1a] dark:text-white dark:border-white/10",
    "dark:hover:bg-[#242424] dark:hover:border-white/20",
  ],
  ghost: [
    "bg-transparent text-[#039751]",
    "hover:bg-[#039751]/8 hover:text-[#027d44]",
    "dark:text-white/70 dark:hover:bg-white/8 dark:hover:text-white",
  ],
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
  const { pending } = useFormStatus();
  const loading = isLoading || (autoLoading && pending);

  return (
    <button
      disabled={loading || disabled}
      aria-busy={loading}
      className={cn(
        "relative inline-flex items-center justify-center",
        "h-10 min-w-[100px] sm:min-w-[140px] px-5",
        "rounded-md",
        "text-[13px] font-semibold tracking-wide uppercase",
        "whitespace-nowrap select-none",
        "transition-colors duration-150",
        "active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-[#84eb4b]/60",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "overflow-hidden",
        iconOnly && "min-w-[40px] px-0",
        VARIANT_STYLES[variant],
        loading && "cursor-wait",
        className
      )}
      {...props}
    >
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
        {children}
      </span>

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
    </button>
  );
}
