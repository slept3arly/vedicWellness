"use client";

import React from "react";
import { cn } from "@/lib/cn";
import Button from "@/components/public/ui/Button";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";

type Props = Omit<React.ComponentPropsWithoutRef<typeof Button>, "variant"> & {
  variant?: Variant;
  icon?: React.ElementType; // Use ElementType to allow passing components
};

export default function AdminButton({
  variant = "secondary",
  className,
  children,
  icon: Icon,
  isLoading,
  ...props
}: Props) {
  const baseVariant =
    variant === "success" || variant === "danger" ? "primary" : variant;

  const variantStyles =
    variant === "success"
      ? "bg-[#039751] hover:bg-[#027d44] dark:bg-[#84eb4b] dark:text-[#0a1a07] dark:hover:bg-[#76d441]"
      : variant === "danger"
      ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white dark:text-white"
      : "";

  return (
    <Button
      variant={baseVariant}
      // We pass isLoading as false to the public button if we want to 
      // handle the custom "spinning icon" manually for the Sync button.
      isLoading={isLoading} 
      autoLoading={props.type === "submit"}
      className={cn("flex items-center justify-center gap-2", variantStyles, className)}
      {...props}
    >
      {Icon && <Icon className={cn("h-4 w-4 shrink-0")} />}
      {children}
    </Button>
  );
}