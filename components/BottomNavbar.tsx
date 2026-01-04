"use client";

import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

/* Reusable Action Button */
function ActionButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="
        h-8 w-8
        flex items-center justify-center
        rounded-full
        bg-gray-200
        cursor-pointer
        select-none
      "
    >
      {children}
    </motion.a>
  );
}

function ScrollToTopButton({ isDark }: { isDark: boolean }) {
  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        h-10 w-10
        rounded-full
        backdrop-blur
        shadow-lg
        flex items-center justify-center
        cursor-pointer
        transition-colors duration-300
        ${isDark ? "bg-gray-400/80 text-white" : "bg-gray-800/80 text-white"}
      `}
      aria-label="Scroll to top"
    >
      ↑
    </motion.button>
  );
}

export default function BottomNavbar() {
  const { scrollY } = useScroll();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll visibility
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setVisible(y > 400);
    });
    return () => unsubscribe();
  }, [scrollY]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* CENTER PILL */}
          <motion.div
            key="bottom-bar"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              mass: 1.1,
            }}
            className={`
              fixed bottom-6 left-1/2 -translate-x-1/2 z-50
              flex items-center gap-4
              px-3 py-3
              rounded-full
              shadow-lg
              backdrop-blur-md
              transition-colors duration-300
              ${isDark ? "bg-gray-400/80" : "bg-gray-800/80"}
            `}
          >
            <ActionButton href="https://wa.me/919466835259">
              <Image src="/whatsapp.png" alt="WhatsApp" width={22} height={22} />
            </ActionButton>

            <ActionButton href="tel:+919466835259">
              <Image src="/phone.png" alt="Call" width={22} height={22} />
            </ActionButton>

            <ActionButton href="https://www.facebook.com/innoviadrugs267/">
              <Image src="/facebook.png" alt="Facebook" width={22} height={22} />
            </ActionButton>
          </motion.div>

          {/* SCROLL TO TOP */}
          <motion.div
            key="scroll-top"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              mass: 1.1,
              delay: 0.05,
            }}
            className="fixed bottom-8 right-6 z-50"
          >
            <ScrollToTopButton isDark={isDark} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
