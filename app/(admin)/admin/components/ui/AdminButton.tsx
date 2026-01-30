"use client";

import clsx from "clsx";
import React from "react";

type Variant = "primary" | "secondary" | "danger" | "success";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
  secondary:
    "bg-muted text-foreground hover:bg-muted/80 focus:ring-border",
  danger:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
  success:
    "bg-green-600 text-white hover:bg-green-700 focus:ring-green-600",
};

export default function AdminButton({
  variant = "primary",
  loading,
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
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-all",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
