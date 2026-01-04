"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden"
    >
      {/* 🔹 BACKGROUND IMAGE */}
      <motion.div
        style={{ opacity: imageOpacity }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/main.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />

        {/* 🔹 THEME-AWARE OVERLAY */}
        {mounted && (
          <div
            className={`absolute inset-0 bg-gradient-to-b ${
              isDark
                ? "from-slate-950/0 via-slate-950/40 to-slate-950"
                : "from-white/0 via-white/20 to-white"
            }`}
          />
        )}
      </motion.div>

      {/* 🔹 CONTENT */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-4 py-40 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold"
        >
          Vedic Wellness
        </motion.h1>

        <motion.h5
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg"
        >
          Best PCD Pharma Franchise
        </motion.h5>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg bg-blue-500 px-5 py-4 text-white"
        >
          Get Started
        </motion.button>
      </div>
    </section>
  );
}
