"use client";

import { useFormStatus } from "react-dom";
import AdminButton from "./AdminButton";
import AdminLoader from "./AdminLoader";

export default function AdminActionButton({
  children,
  variant = "secondary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: any;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <AdminButton
      disabled={pending}
      variant={variant}
      className={`
        transition-all
        ${pending ? "opacity-80 cursor-wait" : "hover:brightness-110"}
        ${className}
      `}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <AdminLoader />
          Processing...
        </span>
      ) : (
        children
      )}
    </AdminButton>
  );
}
