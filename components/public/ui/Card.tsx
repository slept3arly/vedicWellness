"use client";

import { cn } from "@/lib/cn";
import { ReactNode, forwardRef } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"div">;

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "group relative overflow-hidden",
        "rounded-[var(--radius)]",
        "bg-[var(--bg-surface)]",
        "border border-[var(--border-soft)]",
        "shadow-sm",
        "lg:transition-shadow lg:duration-300",
        "lg:group-hover:shadow-[0_20px_50px_rgba(2,101,54,0.25),0_8px_20px_rgba(0,0,0,0.12)]",
        "p-6",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[color:var(--brand-primary)]/35 blur-xl opacity-40 lg:transition-opacity lg:duration-300 lg:group-hover:opacity-100" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/[0.02] to-transparent dark:from-white/[0.03]" />

      <div className="relative z-10">{children}</div>
    </div>
  );
});

export default Card;
