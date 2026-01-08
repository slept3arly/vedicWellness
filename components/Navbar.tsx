"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useMenu } from "@/components/MenuContext"

/**
 * Primary navigation links
 * Used by both desktop nav and fullscreen menu
 */
const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Blogs", path: "/blogs" },
  { label: "About", path: "/about" },
  { label: "Our Products", path: "/products" },
  { label: "Contact Us", path: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()

  /** UI state */
  const { menuOpen, setMenuOpen } = useMenu()
  const [scrollY, setScrollY] = useState(0)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  /**
   * Lock body scroll when fullscreen menu is open
   */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
  }, [menuOpen])

  /**
   * Track scroll position (throttled via rAF)
   * Used for navbar size/position changes
   */
  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /** Navbar layout breakpoint */
  const scrolled100 = scrollY > 100

  return (
    <>
      {/* =========================================================
          NAVBAR (floating, collapses on scroll, hides when menu opens)
         ========================================================= */}
      <nav
        className={`
          fixed left-1/2 -translate-x-1/2 z-40
          h-20
          bg-gray-800/80
          backdrop-blur-md
          shadow-lg
          transition-all duration-300 ease-out
          ${scrolled100 ? "top-8 w-[80%] max-w-4xl" : "top-4 w-[90%] max-w-5xl"}
          ${menuOpen ? "rounded-2xl" : "rounded-full"}
          ${menuOpen ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}
        `}
      >
        <div className="flex items-center justify-between h-full px-7">
          {/* Logo */}
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image
              src="/logo.svg"
              alt="Vedic Wellness"
              width={160}
              height={52}
              priority
              className="h-[48px] w-auto brightness-125"
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex gap-8 text-base font-medium text-gray-300">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                className={`hover:text-white ${pathname === path ? "text-emerald-500" : ""}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="
              lg:hidden
              relative
              w-11 h-11
              rounded-full
              flex items-center justify-center
              text-gray-300
            "
          >
            <span className="absolute w-6 h-0.5 bg-current -translate-y-2" />
            <span className="absolute w-6 h-0.5 bg-current" />
            <span className="absolute w-6 h-0.5 bg-current translate-y-2" />
          </button>
        </div>
      </nav>

      {/* =========================================================
          FULLSCREEN MOBILE MENU
         ========================================================= */}
      <div
        className={`
          fixed inset-0 z-50
          bg-gray-800/90
          transition-opacity duration-300 ease-out
          will-change-transform
          ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
        style={{
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Menu items */}
        <div className="flex flex-col pt-28 px-12 max-w-2xl">
          {NAV_LINKS.map(({ label, path }, i) => (
            <Link
              key={path}
              href={path}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => setHoveredItem(path)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                group flex items-center justify-between
                py-4 text-4xl font-bold text-gray-400
                ${pathname === path ? "text-white" : "text-gray-400 hover:text-gray-100"}
                transition duration-300 ease-in
                ${menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-y-i"}
              `}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span>{label}</span>

              {/* Hover arrow indicator */}
              <svg
                className={`
                  w-6 h-6
                  text-gray-200
                  transition-all duration-300 ease-out
                  ${hoveredItem === path ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                `}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* =========================================================
          FULLSCREEN MENU CLOSE BUTTON
         ========================================================= */}
      <button
        onClick={() => setMenuOpen(false)}
        aria-label="Close menu"
        className={`
          fixed top-9 right-12 z-[60]
          w-11 h-11
          rounded-full
          flex items-center justify-center
          text-gray-400
          hover:text-gray-100
          transition-all duration-300 ease-out
          ${menuOpen
            ? "opacity-100 scale-100 delay-[450ms]"
            : "opacity-0 scale-0 pointer-events-none"
          }
        `}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </>
  )
}
