"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import RibbonLoader from "@/components/public/RibbonLoader";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <RibbonLoader />
    </div>
  );
}
