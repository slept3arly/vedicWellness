"use client";

/* ===================== Imports ===================== */
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useReducedMotion
} from "framer-motion";

/* ===================== Constants ===================== */

// Navigation links
const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Blogs", path: "/blogs" },
  { label: "About", path: "/about" },
  { label: "Our Products", path: "/products" },
  { label: "Contact Us", path: "/contact" },
];

// Mobile menu container animation
const mobileMenuVariants = {
  closed: {
    opacity: 0,
    transition: { staggerChildren: 0, staggerDirection: -1 },
  },
  open: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

// Individual mobile menu item animation
const mobileMenuItemVariants = {
  closed: { opacity: 0, y: -8 },
  open: { opacity: 1, y: 0 },
};

/* ===================== Component ===================== */

export default function Navbar() {
  /* ---------- Router / Path ---------- */
  const pathname = usePathname();
  const router = useRouter();

  /* ---------- Theme ---------- */
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  /* ---------- State ---------- */
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* ---------- Scroll Animations ---------- */
  const { scrollY } = useScroll();

  const rawWidth = useTransform(scrollY, [0, 100], ["100%", "85%"]);
  const rawPadding = useTransform(scrollY, [0, 100], ["20px", "15px"]);
  const rawTop = useTransform(scrollY, [0, 100], ["0px", "25px"]);
  const prefersReducedMotion = useReducedMotion();
  const width = useSpring(rawWidth, {
    stiffness: prefersReducedMotion ? 120 : 300,
    damping: prefersReducedMotion ? 25 : 20,
  });
  const padding = useSpring(rawPadding, { stiffness: 300, damping: 20 });
  const top = useSpring(rawTop, { stiffness: 300, damping: 20 });

  /* ===================== Handlers ===================== */

  // Smart navigation handler (scroll to top if already on page)
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

  // Active link styles
  const linkClass = (path: string) =>
    pathname === path
      ? "text-white font-semibold"
      : "text-gray-300 hover:text-white";

  /* ===================== Effects ===================== */

  // Scroll threshold detection (avoids unnecessary re-renders)
  useEffect(() => {
    NAV_LINKS.forEach(({ path }) => {
      router.prefetch(path);
      });
    }, [router]);

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

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent hydration mismatch (next-themes)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  /* ===================== Render ===================== */

  return (
    <motion.nav
      style={{
      width,
      padding,
      top,
      willChange: "transform, width, padding, top",
      transform: "translateZ(0)",
      }}
      animate={{
        borderRadius: scrolled ? "35px" : "0px",
        height: menuOpen ? "150px" : scrolled ? "65px" : "75px",

      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`
        fixed left-1/2 -translate-x-1/2 z-50
        flex flex-col md:flex-row md:items-center
        justify-between
        backdrop-blur overflow-hidden
        transition-colors duration-300
        ${isDark ? "bg-gray-400/80" : "bg-gray-800/80"}
      `}
    >
      {/* ================= TOP ROW ================= */}
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          onClick={() => handleNav("/")}
          className="px-4 text-2xl font-bold tracking-tighter text-left leading-none"
        >
          <span className="text-white">Vedic</span>
          <span className="text-green-500 italic">WELLNESS</span>
          <div className="text-[8px] mt-1 px-7 uppercase tracking-widest text-green-400">
            A Division of Innovia Drugs
          </div>
        </motion.button>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden px-4"
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <span className="block h-[2px] w-7 bg-white" />
            <span className="block h-[2.5px] w-7 bg-white" />
            <span className="block h-[2.5px] w-7 bg-white" />
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 px-6 text-base">
          {NAV_LINKS.map(({ label, path }) => (
            <motion.button
              key={path}
              //whileHover={{ scale: 1.05 }}
              //whileTap={{ scale: 1 }}
              onClick={() => handleNav(path)}
              className={`relative pb-1 ${linkClass(path)}`}
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

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="
              grid md:hidden
              grid-cols-2 sm:grid-cols-3
              gap-x-6 gap-y-3
              justify-items-center
              py-4
"


          >
            {NAV_LINKS.map(({ label, path }) => (
              <motion.button
                key={path}
                variants={mobileMenuItemVariants}
                //whileHover={{ scale: 1.05 }}
                //whileTap={{ scale: 1 }}
                onClick={() => handleNav(path)}
                className={`text-lg ${
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
