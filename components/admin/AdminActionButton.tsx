"use client";

import React from "react";
import AdminButton from "./AdminButton";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";

export default function AdminActionButton({
  children,
  variant = "secondary",
  className,
  form,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  form?: string;
}) {
  return (
    <AdminButton
      type="submit"
      autoLoading
      variant={variant}
      form={form}
      className={className}
    >
      {children}
    </AdminButton>
  );
}