"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Blogs", path: "/blogs" },
  { label: "About", path: "/about" },
  { label: "Our Products", path: "/products" },
  { label: "Contact Us", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted) return null;

  const scrolled100 = scrollY > 100;

  return (
    <nav
      className={`
        fixed z-50 left-1/2 -translate-x-1/2
        transition-all duration-500 ease-in-out
        rounded-full h-20 shadow-lg backdrop-blur-md
        ${scrolled100 ? "top-8 w-[80%] max-w-5xl" : "top-4 w-[90%] max-w-7xl"}
        bg-gray-800/80 dark:bg-gray-400/80
      `}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          prefetch
          className="flex items-center"
          onClick={() => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Image
            src="/logo.svg"
            alt="Vedic Wellness"
            width={160}
            height={52}
            priority
            draggable={false}
            className="h-[52px] w-auto brightness-125 dark:brightness-75"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 text-base font-medium">
          {NAV_LINKS.map(({ label, path }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                prefetch
                className={`
                  relative pb-1 transition-colors
                  ${active
                    ? "text-green-600 dark:text-emerald-800"
                    : "text-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"}
                `}
              >
                {label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-green-600 dark:bg-emerald-800" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="lg:hidden p-3 text-gray-300 dark:text-gray-800"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-current transition-transform ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-opacity ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-transform ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden overflow-hidden transition-all duration-300 ease-out
          ${mobileOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"}
        `}
      >
        <div className="flex flex-col items-center gap-3 px-6 pt-2">
          {NAV_LINKS.map(({ label, path }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                prefetch
                onClick={() => setMobileOpen(false)}
                className={`
                  text-base font-medium transition-colors
                  ${active
                    ? "text-emerald-500 hover:font-bold"
                    : "text-gray-400 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"}
                `}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
