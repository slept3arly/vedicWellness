"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px]"
    >
      <div className="h-full w-full bg-[var(--brand-accent)] animate-route-loader" />
    </div>
  );
}
