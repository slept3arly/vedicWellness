"use client";

import React from "react";
import Button from "@/components/public/ui/Button";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";

export default function AdminActionButton({
  children,
  variant = "secondary",
  className = "",
  form,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  form?: string;
}) {
  const baseVariant =
    variant === "success" || variant === "danger" ? "primary" : variant;

  const variantStyles =
    variant === "success"
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "";

  return (
    <Button
      autoLoading
      variant={baseVariant}
      type="submit"
      form={form}
      className={cn(variantStyles, className)}
    >
      {children}
    </Button>
  );
}