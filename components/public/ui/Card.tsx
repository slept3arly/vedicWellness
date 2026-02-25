"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ReactNode, forwardRef } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof motion.div>;

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, ...props },
  ref
) {
  return (
    <motion.div
      ref={ref}   // ⭐ THIS IS THE FIX
      {...props}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      layout
      style={{ willChange: "transform" }}
      className={cn(
        "relative overflow-hidden",
        "rounded-[var(--radius)]",

        /* footer/global surface system */
        "bg-[var(--bg-surface)]",
        "border border-[var(--border-soft)]",

        "shadow-sm hover:shadow-md",
        "p-6",
        className
      )}
    >
      {/* neutral overlay */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-b
          from-black/[0.02]
          to-transparent
          dark:from-white/[0.03]
        "
      />

      {children}
    </motion.div>
  );
});

export default Card;