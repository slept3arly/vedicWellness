"use client";

import clsx from "clsx";
import React from "react";

type Variant = "default" | "secondary" | "success" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

const hoverMap: Record<Variant, string> = {
  default:
    "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500",

  secondary:
    "hover:bg-neutral-800 hover:text-white hover:border-neutral-800 dark:hover:bg-neutral-700",

  success:
    "hover:bg-emerald-600 hover:text-white hover:border-emerald-600",

  danger:
    "hover:bg-red-600 hover:text-white hover:border-red-600",
};



export default function AdminButton({
  variant = "default",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading}
      className={clsx(
        `
        inline-flex items-center justify-center gap-2
        h-11 min-w-[104px]
        whitespace-nowrap
        rounded-xl px-5
        text-sm font-semibold
        
        hover:shadow-sm

        bg-white text-neutral-900
        border border-neutral-400

        dark:bg-neutral-900 dark:text-white
        dark:border-neutral-700

        transition-colors transition-transform duration-150 ease-out

        active:scale-[0.96]

        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-neutral-500

        disabled:opacity-50 disabled:pointer-events-none
        `,
        hoverMap[variant],
        className
      )}
    >
      {loading ? (
        <span className="font-medium tracking-wide animate-pulse select-none">
          Working…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
