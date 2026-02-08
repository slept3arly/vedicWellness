import React from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  tone?: "brand" | "neutral";
};

export default function Badge({ children, tone = "brand" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-4 py-1.5 text-xs font-medium rounded-full border backdrop-blur",
        tone === "brand" &&
          "bg-[color-mix(in_srgb,var(--brand-primary)_12%,transparent)] text-[var(--brand-primary)] border-[color-mix(in_srgb,var(--brand-primary)_25%,transparent)]",
        tone === "neutral" &&
          "bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-soft)]"
      )}
    >
      {children}
    </span>
  );
}
