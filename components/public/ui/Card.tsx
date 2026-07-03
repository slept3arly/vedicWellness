"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ReactNode, forwardRef, useEffect, useState } from "react";

// Extract media query hook for reusability
const useDesktopMediaQuery = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(media.matches);

    const listener = () => setIsDesktop(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isDesktop;
};

type CardProps = {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof motion.div>;

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, ...props },
  ref
) {
  const isDesktop = useDesktopMediaQuery();

  return (
    <motion.div
      ref={ref}
      {...props}
      whileHover={isDesktop ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      layout
      style={{ willChange: "transform" }}
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
    </motion.div>
  );
});

export default Card;