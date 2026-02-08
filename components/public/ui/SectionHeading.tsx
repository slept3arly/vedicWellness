import React from "react";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: Props) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 font-body text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}
