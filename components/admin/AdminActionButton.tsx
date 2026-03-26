"use client";

import React from "react";
import AdminButton from "./AdminButton";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";

export default function AdminActionButton({
  children,
  variant = "secondary",
  className,
  form,
  type = "submit",
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  form?: string;
  type?: "button" | "submit";
}) {
  return (
    <AdminButton
      type={type}
      autoLoading
      variant={variant}
      form={form}
      className={className}
    >
      {children}
    </AdminButton>
  );
}