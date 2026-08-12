"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Turnstile, type TurnstileProps } from "@marsidev/react-turnstile";
import { cn } from "@/lib/cn";

type TurnstileFieldProps = Omit<
  TurnstileProps,
  "className" | "options" | "style"
> & {
  className?: string;
  options?: TurnstileProps["options"];
};

const TURNSTILE_BASE_WIDTH = 300;
const TURNSTILE_BASE_HEIGHT = 65;

export default function TurnstileField({
  className,
  options,
  ...turnstileProps
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const rectWidth = el.getBoundingClientRect().width;

      // 64px accounts for 32px page padding + 32px card padding on mobile
      const viewportAvailable =
        typeof window !== "undefined"
          ? Math.max(0, window.innerWidth - 64)
          : rectWidth;

      const availableWidth = Math.min(
        rectWidth > 0 ? rectWidth : viewportAvailable,
        viewportAvailable
      );

      if (availableWidth > 0 && availableWidth < TURNSTILE_BASE_WIDTH) {
        setScale(availableWidth / TURNSTILE_BASE_WIDTH);
      } else {
        setScale(1);
      }
    };

    updateScale();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    if (el.parentElement) {
      observer.observe(el.parentElement);
    }

    return () => observer.disconnect();
  }, []);

  const scaledHeight = Math.round(TURNSTILE_BASE_HEIGHT * scale);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full min-w-0 max-w-full flex justify-center items-center overflow-hidden",
        className
      )}
      style={{
        minHeight: `${scaledHeight}px`,
        height: `${scaledHeight}px`,
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: `${TURNSTILE_BASE_WIDTH}px`,
          height: `${TURNSTILE_BASE_HEIGHT}px`,
          transform: scale < 1 ? `scale(${scale})` : "none",
          transformOrigin: "center center",
        }}
      >
        <Turnstile
          {...turnstileProps}
          options={{
            ...options,
            size: "normal",
          }}
        />
      </div>
    </div>
  );
}