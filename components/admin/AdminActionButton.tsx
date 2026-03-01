"use client";

import Button from "@/components/public/ui/Button";

export default function AdminActionButton({
  children,
  variant = "secondary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: any;
  className?: string;
}) {
  return (
    <Button
      autoLoading
      variant={variant}
      className={className}
      type="submit"
    >
      {children}
    </Button>
  );
}