"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

const SHOW_THRESHOLD = 160;
const DIRECTION_DELTA = 6;

export default function ScrollAwareHeader({
  children,
}: {
  children: ReactNode;
}) {
  const [hidden, setHidden] = useState(false);
  const [offset, setOffset] = useState(0);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);
  const hasMarqueeRef = useRef(false);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setHidden(false);
  }

  useEffect(() => {
    hiddenRef.current = hidden;
  }, [hidden]);

  useEffect(() => {
    document.documentElement.dataset.headerHidden = hidden ? "true" : "false";
  }, [hidden]);

  useEffect(() => {
    const measure = () => {
      const el = document.querySelector<HTMLElement>(".public-marquee");
      hasMarqueeRef.current = !!el;
      setOffset(el ? el.offsetTop : 0);
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    lastYRef.current = window.scrollY;
  }, [pathname]);

  useEffect(() => {
    lastYRef.current = window.scrollY;
    const onScroll = () => {
      if (!hasMarqueeRef.current) return;
      const y = window.scrollY;
      if (y <= SHOW_THRESHOLD) {
        lastYRef.current = y;
        if (hiddenRef.current) setHidden(false);
        return;
      }
      const delta = y - lastYRef.current;
      lastYRef.current = y;
      if (Math.abs(delta) < DIRECTION_DELTA) return;
      const next = delta > 0;
      if (next !== hiddenRef.current) setHidden(next);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="scroll-aware-header fixed top-0 left-0 right-0 z-40"
      data-hidden={hidden ? "true" : "false"}
      style={{ "--header-offset": `${offset}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
