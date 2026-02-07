"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cardIconGlow } from "@/app/animations";

type Props = {
  children: ReactNode;
};

export default function CardIcon({ children }: Props) {
  return (
    <div className="relative inline-flex">
      {/* glow */}
      <motion.span
        variants={cardIconGlow}
        className="
          pointer-events-none
          absolute inset-0 -z-10
          rounded-full
          bg-[radial-gradient(circle,rgba(88,157,50,0.45),transparent_70%)]
          blur-xl
          opacity-0
          group-hover:opacity-100
        "
      />

      {children}
    </div>
  );
}
