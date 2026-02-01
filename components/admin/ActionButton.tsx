"use client";

import { useTransition } from "react";
import AdminButton from "./AdminButton";
import AdminLoader from "./AdminLoader";

export default function ActionButton({
  action,
  data,
  variant = "secondary",
  children,
}: {
  action: (fd: FormData) => Promise<void>;
  data: Record<string, string>;
  variant?: any;
  children: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();

  function run() {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    startTransition(() => action(fd));
  }

  return (
    <AdminButton
      onClick={run}
      disabled={pending}
      variant={variant}
      className="relative"
    >
      {pending ? <AdminLoader /> : children}
    </AdminButton>
  );
}
