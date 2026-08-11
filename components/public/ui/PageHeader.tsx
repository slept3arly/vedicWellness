"use client";

import React from "react";
import { cn } from "@/lib/cn";

type Props = {
  badge?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
};

export default function PageHeader({
  badge,
  title,
  subtitle,
  align = "center",
  className,
}: Props) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={cn("max-w-5xl space-y-4", alignment, className)}>
      {badge && <div className="flex justify-center">{badge}</div>}

      <h1
        className="
          font-display
          text-4xl sm:text-5xl lg:text-6xl
          font-semibold tracking-tight
          leading-tight
          text-slate-900 dark:text-white
        "
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="
            font-body
            text-base sm:text-lg
            text-slate-600 dark:text-slate-300
            leading-relaxed
          "
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}