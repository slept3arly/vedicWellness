import React from "react";
import { cn } from "@/lib/cn";

type Props = {
  badge?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  size?: "md" | "lg";
  className?: string;
};

export default function PageHeader({
  badge,
  title,
  subtitle,
  align = "center",
  size = "lg",
  className,
}: Props) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={cn("max-w-5xl space-y-4", alignment, className)}>
      {badge && <div className="flex justify-center">{badge}</div>}

      <h1
        className={cn(
          "font-display font-semibold tracking-tight leading-tight text-slate-900 dark:text-white",
          size === "lg"
            ? "text-4xl sm:text-5xl lg:text-6xl"
            : "text-3xl sm:text-4xl lg:text-5xl"
        )}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={cn(
            "font-body text-slate-600 dark:text-slate-300 leading-relaxed",
            size === "lg" ? "text-base sm:text-lg" : "text-sm sm:text-base"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}