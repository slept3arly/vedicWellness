"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RouteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const showTimer = useRef<NodeJS.Timeout | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 🔥 Always scroll to top immediately on route change
    window.scrollTo({ top: 0, behavior: "instant" });

    // Delay showing loader to prevent flicker on fast routes
    showTimer.current = setTimeout(() => {
      setVisible(true);
    }, 300);

    // Auto-hide loader after short duration
    hideTimer.current = setTimeout(() => {
      setVisible(false);
    }, 700);

    return () => {
      if (showTimer.current) {
        clearTimeout(showTimer.current);
        showTimer.current = null;
      }

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div className="h-full w-full bg-[var(--brand-accent)] animate-route-loader" />
    </div>
  );
}