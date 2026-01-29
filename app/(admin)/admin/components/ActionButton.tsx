"use client";

import { useFormStatus } from "react-dom";

export default function ActionButton({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  const { pending } = useFormStatus();

  const base =
    "rounded-lg px-3 py-1 text-sm transition border disabled:opacity-60 disabled:cursor-not-allowed";

  const styles =
    variant === "danger"
      ? "border-red-500/40 hover:bg-red-500/10"
      : "border-neutral-700 hover:bg-neutral-800";

  return (
    <button disabled={pending} className={`${base} ${styles}`}>
      {pending ? "Processing..." : children}
    </button>
  );
}
