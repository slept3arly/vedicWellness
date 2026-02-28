"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RouteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const showTimer = useRef<NodeJS.Timeout | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    showTimer.current = setTimeout(() => {
      setVisible(true);
    }, 300);

    hideTimer.current = setTimeout(() => {
      setVisible(false);
    }, 700); // ← shorter duration feels more natural

    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div className="h-full w-full bg-[var(--brand-accent)] animate-route-loader" />
    </div>
  );
}
