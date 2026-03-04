"use client";

import React from "react";
import { cn } from "@/lib/cn";
import Button from "@/components/public/ui/Button";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";

type Props = Omit<React.ComponentProps<typeof Button>, "variant"> & {
  variant?: Variant;
};

export default function AdminButton({
  variant = "secondary",
  className,
  children,
  ...props
}: Props) {
  const baseVariant =
    variant === "success" || variant === "danger" ? "primary" : variant;

  // Override the primary brand-green with semantic colors for admin actions
  const variantStyles =
    variant === "success"
      ? "bg-[#039751] hover:bg-[#027d44] dark:bg-[#84eb4b] dark:text-[#0a1a07] dark:hover:bg-[#76d441]"
      : variant === "danger"
      ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white dark:text-white"
      : "";

  return (
    <Button
      variant={baseVariant}
      autoLoading={props.type === "submit"}
      className={cn(variantStyles, className)}
      {...props}
    >
      {children}
    </Button>
  );
}