"use client";

import React from "react"

import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

export default function AdminButton({
  variant = "primary",
  loading,
  className,
  children,
  disabled,
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
        "disabled:opacity-60 disabled:cursor-not-allowed active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-950",

        variant === "primary" &&
          "bg-green-600/20 border-green-500/40 text-green-300 hover:bg-green-600/30 focus-visible:ring-green-400",

        variant === "secondary" &&
          "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 focus-visible:ring-neutral-500",

        variant === "danger" &&
          "bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30 focus-visible:ring-red-400",

        className
      )}
      aria-busy={loading}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && (
          <span className="inline-block animate-spin">
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        {children}
      </span>
    </button>
  );
}
