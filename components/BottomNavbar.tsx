"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export default function BottomNavbar() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setVisible(y > 400); // 👈 threshold (adjust)
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.div
      initial={false}
      animate={{
        y: visible ? 0 : 40,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 25 }}
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        z-50
        flex items-center gap-6
        px-6 py-3
        bg-white/70 backdrop-blur-md
        rounded-full
        shadow-lg
      "
    >
      {/* Progress */}
      <div className="h-2 w-14 rounded-full bg-gray-300 overflow-hidden">
        <div className="h-full w-1/2 bg-gray-600 rounded-full" />
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === 2 ? "bg-gray-700" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Action */}
      <button
        className="
          h-10 w-10
          rounded-full
          bg-gray-200
          flex items-center justify-center
          hover:bg-gray-300
          transition
        "
      >
        ▶
      </button>
    </motion.div>
  );
}
