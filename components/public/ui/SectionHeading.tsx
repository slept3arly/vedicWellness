import React from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: Props) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={cn("max-w-2xl space-y-2", alignment, className)}>
      {eyebrow && (
        <p className="font-accent text-sm italic text-slate-500 dark:text-slate-400">
          {eyebrow}
        </p>
      )}

      <h2
        className="
        font-heading
        text-2xl md:text-3xl
        font-semibold
        tracking-tight
        text-slate-900 dark:text-white
      "
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className="
          font-body
          text-sm md:text-base
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