"use client";

import { usePathname, useRouter } from "next/navigation";
import {  useEffect, useState } from "react";

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

  // ---- Scroll-based pill animation
  const rawWidth = useTransform(scrollY, [0, 100], ["100%", "85%"]);
  //const rawRadius = useTransform(scrollY, [0, 100], ["0px", "50px"]);
  const rawPadding = useTransform(scrollY, [0, 100], ["20px", "15px"]);
  const rawTop = useTransform(scrollY, [0, 100], ["0px", "25px"]);

  const width = useSpring(rawWidth, { stiffness: 300, damping: 20 });
  //const borderRadius = useSpring(rawRadius, { stiffness: 300, damping: 20 });
  const padding = useSpring(rawPadding, { stiffness: 300, damping: 20 });
  const top = useSpring(rawTop, { stiffness: 300, damping: 20 });
  

  // ---- SMART NAV HANDLER
  const handleNav = (path: string) => {
    if (pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(path);
    }
  };

  // ---- ACTIVE LINK STYLES
  const linkClass = (path: string) =>
    pathname === path
      ? "text-white font-semibold"
      : "text-gray-300 hover:text-white";

  useEffect(() => {
  const unsubscribe = scrollY.on("change", (y) => {
    setScrolled(y > 80); // threshold
  });

  return () => unsubscribe();
}, [scrollY]);


  return (
    <motion.nav
      style={{ width, padding, top }}
      animate={{
      borderRadius: scrolled
        ? menuOpen
        ? "45px"   // scrolled + menu open
          : "50px"   // scrolled + menu closed
          : "0px",     // top of page

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
          className="px-4 text-2xl cursor-pointer font-bold tracking-tighter text-left"
        >
          <span className="text-white">Vedic</span>
          <span className="text-green-500 italic">WELLNESS</span>
          <div className="text-[8px] px-7 uppercase tracking-widest text-green-400">
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
            <span className="block h-[2px] w-6 bg-white" />
            <span className="block h-[2px] w-6 bg-white" />
            <span className="block h-[2px] w-6 bg-white" />
          </div>
        </button>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-6 px-6 text-base">
          {[
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
          ].map(({ label, path }) => (
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
      {menuOpen && (
        <div className="flex flex-col items-center md:hidden pb-2 gap-4">
          {[
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
          ].map(({ label, path }) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              key={path}
              onClick={() => handleNav(path)}
              className={`text-lg cursor-pointer ${
                pathname === path
                  ? "text-white font-semibold"
                  : "text-gray-300"
              }`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      )}
    </motion.nav>
  );
}