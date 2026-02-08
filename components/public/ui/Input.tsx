import React from "react";
import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
  return (
    <input
      {...props}
      className={cn(
        "w-full px-4 py-3 rounded-[14px]",
        "bg-[var(--bg-surface)] border border-[var(--border-soft)]",
        "text-[var(--text-main)] placeholder:text-[var(--text-muted)]",
        "transition focus:outline-none",
        "focus:border-[color-mix(in_srgb,var(--brand-primary)_40%,transparent)]",
        "focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-primary)_25%,transparent)]",
        className
      )}
    />
  );
}
