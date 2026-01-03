"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    
    <div className="flex flex-col min-h-screen items-center gap-3 py-40 px-4">
      
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .4 }}
        className="text-4xl"
      >
        Vedic Wellness
      </motion.h1>

        <motion.h5
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .4, delay:0.2 }}
        className="text-1xl"
      >
        Best PCD Pharma Franchise
      </motion.h5>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: .95 }}
        className="px-5 py-4 bg-blue-500 rounded-lg "
      >
        Get Started
      </motion.button>
    </div>
  );
}
