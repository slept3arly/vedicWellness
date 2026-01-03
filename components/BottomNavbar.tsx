"use client";

import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

/* ✅ MOVE THIS TO THE TOP */
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

export default function BottomNavbar() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setVisible(y > 400);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <AnimatePresence>
      {visible && (
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
          className="
            fixed bottom-6 left-1/2 -translate-x-1/2
            z-50
            flex items-center gap-6
            px-3 py-3
            bg-white/70 backdrop-blur-md
            rounded-full
            shadow-lg
          "
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
      )}
    </AnimatePresence>
  );
}
