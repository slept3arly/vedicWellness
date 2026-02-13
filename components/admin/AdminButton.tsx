"use client";

import React from "react";
import clsx from "clsx";
import Button from "@/components/public/ui/Button";

type Variant = "default" | "secondary" | "success" | "danger";

type Props = Omit<React.ComponentProps<typeof Button>, "variant"> & {
  variant?: Variant;
};

const hoverMap: Record<Variant, string> = {
  default:
    "bg-white text-neutral-900 border border-neutral-400 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500",

  secondary:
    "bg-white text-neutral-900 border border-neutral-400 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:bg-neutral-800 hover:text-white hover:border-neutral-800 dark:hover:bg-neutral-700",

  success:
    "bg-white text-neutral-900 border border-neutral-400 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600",

  danger:
    "bg-white text-neutral-900 border border-neutral-400 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:bg-red-600 hover:text-white hover:border-red-600",
};

export default function AdminButton({
  variant = "default",
  className,
  children,
  ...props
}: Props) {
  return (
    <Button
      className={clsx(
        `
        h-11 min-w-[104px]
        whitespace-nowrap
        rounded-xl px-5
        text-sm font-semibold
        hover:shadow-sm
        active:scale-[0.96]
        focus-visible:ring-neutral-500
        `,
        hoverMap[variant],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
