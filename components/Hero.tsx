"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes"

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
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

      {/* MOBILE CONTENT */}
      <div className="relative z-10 flex flex-col pt-40">
        <div className="flex flex-row font-heading px-10 gap-1">
          <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold text-black dark:text-white"
          >
            Welcome to
          </motion.h1>

          <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold text-green-700 dark:text-green-400"
          >
            VEDIC WELLNESS
          </motion.h1>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="tracking-tighter italic font-semibold text-black dark:text-white text-right px-10 pb-10 font-heading"
          >
            A Division of Innovia Drugs
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-2xl italic text-black dark:text-white text-left px-24 font-quote"
        >
          Innovating Ayurveda,

        </motion.h3>
        
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-2xl italic text-black dark:text-white text-right px-24 font-quote pb-40"
        >
          Preserving Tradition

        </motion.h3>
        <motion.h5
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg text-black dark:text-white text-justify px-5 font-body"
        >

          At Vedic Wellness, we blend the timeless wisdom of Ayurveda with modern science to create patented, high-quality Ayurvedic products that promote holistic health and well-being.

        </motion.h5>
      </div>
    </section>
  );
}
