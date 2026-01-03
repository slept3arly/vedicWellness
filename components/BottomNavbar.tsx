"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

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
        px-3 py-3
        bg-white/70 backdrop-blur-md
        rounded-full
        shadow-lg
      "
    >
      {/* WHATSAPP */}
      <ActionButton href="https://wa.me/919466835259">
        <Image
          src="/whatsapp.png"
          alt="Call"
          width={22}
          height={22}
        />
      </ActionButton>
      
      {/* CALL */}
      <ActionButton href="tel:+919466835259">
        <Image
          src="/phone.png"
          alt="Call"
          width={22}
          height={22}
        />
      </ActionButton>

      {/* FACEBOOK */}
      <ActionButton href="https://www.facebook.com/innoviadrugs267/">
        <Image
          src="/facebook.png"
          alt="Call"
          width={22}
          height={22}
        />
      </ActionButton>
    </motion.div>
  );
}

/* Reusable button */
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
        text-xl
        cursor-pointer
        select-none
      "
    >
      {children}
    </motion.a>
  );
}
