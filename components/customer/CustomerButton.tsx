"use client";

import Button from "@/components/public/ui/Button";
import { cn } from "@/lib/cn";
import { MotionProps } from "framer-motion";

type CustomerButtonProps =
  React.ComponentPropsWithoutRef<"button"> &
  MotionProps & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    ignoreFormStatus?: boolean;
    isLoading?: boolean;
  };

export default function CustomerButton({
  ignoreFormStatus = false,
  isLoading,
  className,
  ...props
}: CustomerButtonProps) {
  return (
    <Button
      autoLoading={!ignoreFormStatus}
      isLoading={isLoading}
      className={cn(className)}
      {...props}
    />
  );
}