"use client";

import React from "react";
import AdminButton from "./AdminButton";
import { Loader2 } from "lucide-react"; // Or your preferred loader icon

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";

export default function AdminActionButton({
  children,
  variant = "secondary",
  className,
  form,
  type = "submit",
  icon: Icon, // Allow passing an icon through
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  form?: string;
  type?: "button" | "submit";
  icon?: any;
}) {
  return (
    <AdminButton
      type={type}
      // Pass the icon prop; AdminButton uses this + type="submit" 
      // to trigger the internal auto-loading spinner
      icon={Icon} 
      variant={variant}
      form={form}
      className={className}
    >
      {children}
    </AdminButton>
  );
}