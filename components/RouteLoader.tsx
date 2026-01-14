"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import RibbonLoader from "./RibbonLoader";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);


  const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

useEffect(() => {
  if (!mounted) return;
  setLoading(true);
  const t = setTimeout(() => setLoading(false), 500);
  return () => clearTimeout(t);
}, [pathname, mounted]);

  useEffect(() => {
    // show loader on every route change
    setLoading(true);

    // hide shortly after (smooth)
    const t = setTimeout(() => setLoading(false), 500);

    return () => clearTimeout(t);
  }, [pathname]);

  return loading ? <RibbonLoader /> : null;
}
