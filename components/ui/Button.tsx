"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-600/40";

  const sizes: Record<Size, string> = {
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-[#039751] text-white shadow-lg shadow-green-600/20 hover:bg-green-700",
    secondary:
      "border border-slate-200 bg-white/70 text-slate-900 shadow-sm   hover:bg-white hover:text-black dark:border-slate-800 dark:bg-slate-900/40 dark:text-white",
    ghost:
      "border border-green-600/25 bg-green-500/10 text-green-800 hover:bg-green-500/15 dark:text-green-200",
  };

  return (
    <button
      {...props}
      className={[base, sizes[size], variants[variant], className].join(" ")}
    />
  );
}
