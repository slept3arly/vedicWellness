"use client";

import Button from "@/components/public/ui/Button";
import { MotionProps } from "framer-motion";

type CustomerButtonProps = React.ComponentPropsWithoutRef<"button"> &
  MotionProps & {
    variant?: "primary" | "secondary" | "ghost";
    ignoreFormStatus?: boolean;
    isLoading?: boolean;
    iconOnly?: boolean;
  };

export default function CustomerButton({
  ignoreFormStatus = false,
  isLoading,
  iconOnly = false,
  className = "",
  ...props
}: CustomerButtonProps) {
  // Enforces a standard dashboard button height and minimum width
  const combinedClasses = `h-11 min-w-[140px] ${className}`;
  
  return (
    <Button
      autoLoading={!ignoreFormStatus}
      isLoading={isLoading}
      iconOnly={iconOnly}
      className={combinedClasses}
      {...props}
    />
  );
}