"use client";

import { usePathname, useRouter } from "next/navigation";
import {  useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useCallback } from 'react';

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuVariants = {
  closed: { opacity: 0, transition: { staggerChildren: 0, staggerDirection: -1 } },
  open: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const mobileMenuItemVariants = {
  closed: { opacity: 0, y: -8 },
  open: { opacity: 1, y: 0 },
};



  // ---- Scroll-based pill animation
  const rawWidth = useTransform(scrollY, [0, 100], ["100%", "85%"]);
  //const rawRadius = useTransform(scrollY, [0, 100], ["0px", "50px"]);
  const rawPadding = useTransform(scrollY, [0, 100], ["20px", "15px"]);
  const rawTop = useTransform(scrollY, [0, 100], ["0px", "25px"]);

  const width = useSpring(rawWidth, { stiffness: 300, damping: 20 });
  //const borderRadius = useSpring(rawRadius, { stiffness: 300, damping: 20 });
  const padding = useSpring(rawPadding, { stiffness: 300, damping: 20 });
  const top = useSpring(rawTop, { stiffness: 300, damping: 20 });
  
  const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];


  // ---- SMART NAV HANDLER
  const handleNav = useCallback(
  (path: string) => {
    if (pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(path);
    }
  },
  [pathname, router]
);


  // ---- ACTIVE LINK STYLES
  const linkClass = (path: string) =>
    pathname === path
      ? "text-white font-semibold"
      : "text-gray-300 hover:text-white";

  useEffect(() => {
  let last = false;

  const unsubscribe = scrollY.on("change", (y) => {
    const next = y > 80;
    if (next !== last) {
      last = next;
      setScrolled(next);
    }
  });

  return unsubscribe;
}, [scrollY]);

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setMenuOpen(false);
    }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);



  return (
    <motion.nav
      style={{ width, padding, top }}
      animate={{
      borderRadius: scrolled ? (menuOpen ? "30px" : "24px") : "0px",
      height: menuOpen ? "115px" : "75px",
      }}

      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="
        fixed left-1/2 -translate-x-1/2 z-50
        flex-col
        md:flex-row md:items-center
        flex justify-between
        bg-gray-500/80 backdrop-blur
        text-white
        overflow-hidden
      "
    >
      {/* TOP ROW */}
      <div className="flex items-center justify-between w-full">
        {/* LOGO */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          onClick={() => handleNav("/")}
          className="px-4 text-2xl cursor-pointer font-bold tracking-tighter text-left leading-none"
        >
          <span className="text-white">Vedic</span>
          <span className="text-green-500 italic">WELLNESS</span>
          <div className="text-[8px] mt-1 px-7 uppercase tracking-widest text-green-400">
            A Division of Innovia Drugs
          </div>
        </motion.button>

        {/* HAMBURGER (mobile only) */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden px-4 cursor-pointer"
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <span className="block h-[3.5px] w-7 bg-white" />
            <span className="block h-[2.5px] w-7 bg-white" />
            <span className="block h-[1.5px] w-7 bg-white" />
          </div>
        </button>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-6 px-6 text-base">
          {NAV_LINKS.map(({ label, path }) => (
            <motion.button
              key={path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              onClick={() => handleNav(path)}
              className={`relative pb-1 cursor-pointer ${linkClass(path)}`}
            >
              {label}

              {pathname === path && (
                <motion.div
                  layoutId="navbar-underline"
                  className="absolute left-0 right-0 -bottom-1 h-[2px] bg-green-400 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* MOBILE MENU (INSIDE PILL) */}
      <AnimatePresence>
      {menuOpen && (
        <motion.div
      variants={mobileMenuVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="flex flex-row md:hidden w-full items-center justify-center py-4 pb-4 gap-5"
  >

          {[
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
          ].map(({ label, path }) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              key={path}
              variants={mobileMenuItemVariants}
              onClick={() => handleNav(path)}
              className={`text-lg cursor-pointer text-left${
                pathname === path
                  ? "text-white font-semibold"
                  : "text-gray-300"
              }`}
            >
              {label}
            </motion.button>
          ))}
        </motion.div>
      )}
      </AnimatePresence>
    </motion.nav>
  );
}