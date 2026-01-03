"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();

  // ---- Scroll-based pill animation
  const rawWidth = useTransform(scrollY, [0, 100], ["100%", "85%"]);
  const rawRadius = useTransform(scrollY, [0, 100], ["0px", "50px"]);
  const rawPadding = useTransform(scrollY, [0, 100], ["20px", "15px"]);
  const rawTop = useTransform(scrollY, [0, 100], ["0px", "25px"]);
  const rawShadow = useTransform(scrollY, [0, 100], [
    "0px 0px 0px rgba(0,0,0,0)",
    "0px 10px 30px rgba(0,0,0,0.3)",
  ]);

  const width = useSpring(rawWidth, { stiffness: 300, damping: 20 });
  const borderRadius = useSpring(rawRadius, { stiffness: 300, damping: 20 });
  const padding = useSpring(rawPadding, { stiffness: 300, damping: 20 });
  const top = useSpring(rawTop, { stiffness: 300, damping: 20 });
  const boxShadow = useSpring(rawShadow, { stiffness: 300, damping: 20 });

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

  return (
    <motion.nav
      style={{ width, borderRadius, padding, top, boxShadow }}
      className="
        fixed left-1/2 -translate-x-1/2 z-50
        flex justify-between items-center
        bg-gray-500/80 backdrop-blur
        text-white
      "
    >
      {/* LOGO */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 1 }}
        onClick={() => handleNav("/")}
        className="px-4 text-2xl cursor-pointer font-bold tracking-tighter"
      >
        <span className="text-white">Vedic</span>
        <span className="text-green-500 italic">WELLNESS</span>
        <div className="text-[8px] uppercase tracking-widest text-green-400 text-right">
          A Division of Innovia Drugs
        </div>
      </motion.button>

      {/* NAV LINKS + SLIDING UNDERLINE */}
      <div className="relative flex gap-6 px-6 text-base">
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
            className={`relative pb-1 cursor-pointer ${linkClass(path)}`}
          >
            {label}

            {pathname === path && (
              <motion.div
                layoutId="navbar-underline"
                className="absolute left-0 right-0 -bottom-1 h-[2px] bg-green-400 rounded-full"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
}
