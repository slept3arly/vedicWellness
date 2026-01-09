"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useMenu } from "@/components/MenuContext"

/* ================= DATA ================= */

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Blogs", path: "/blogs" },
  { label: "About", path: "/about" },
  { label: "Our Products", path: "/products" },
  { label: "Contact Us", path: "/contact" },
]

/* ================= COMPONENT ================= */

export default function Navbar() {
  const pathname = usePathname()
  const { menuOpen, setMenuOpen } = useMenu()

  const [scrollY, setScrollY] = useState(0)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  /* ================= EFFECTS ================= */

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
  }, [menuOpen])

  // Track scroll position
  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrolled100 = scrollY > 100

  /* ================= RENDER ================= */

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`
          fixed z-40
          top-3 left-3 right-3 h-16 pb-1
          lg:h-20 lg:top-5 lg:left-9 lg:right-9
          bg-neutral-900/75 backdrop-blur-md shadow-lg
          transition-all duration-300 ease-out
          ${menuOpen ? "rounded-2xl" : "rounded-lg"}
          ${
            menuOpen
              ? "opacity-0 -translate-y-4 pointer-events-none"
              : "opacity-100 translate-y-0"
          }
        `}
      >
        {/* GRID LAYOUT */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full px-4 lg:px-8">
          {/* ---------- LEFT: Mobile Menu + Desktop Nav ---------- */}
          <div className="flex items-center gap-6 pt-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="
                lg:hidden
                relative flex items-center gap-3
                h-8 px-3
                rounded
                text-gray-300
                bg-neutral-600/75 backdrop-blur-md
                hover:bg-neutral-600/50
              "
            >
              {/* Hamburger Icon */}
              <span className="relative block w-5 h-4">
                <span className="absolute top-1 left-0 w-6 h-0.5 bg-current" />
                <span className="absolute top-3 left-0 w-6 h-0.5 -translate-y-0.5 bg-current" />
              </span>

              <span className="text-lg font-thin">Menu</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 text-base font-medium text-gray-300">
              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  href={path}
                  className={`hover:text-white ${
                    pathname === path ? "text-emerald-500" : ""
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* ---------- CENTER: Logo ---------- */}
          <div className="flex justify-center">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <Image
                src="/logo.svg"
                alt="Vedic Wellness"
                width={160}
                height={52}
                priority
                className="h-[40px] w-auto brightness-150 lg:h-[48px]"
              />
            </Link>
          </div>

          {/* ---------- RIGHT: Auth Buttons ---------- */}
          <div className="flex items-center justify-end gap-2 pt-1">
            {/* Login */}
            <Link
              href="/login"
              className="lg:inline-block bg-[#84eb4b] px-4 py-2 text-sm font-medium text-gray-900 rounded hover:bg-white"
            >
              Login
            </Link>

            {/* Sign Up */}
            <Link
              href="/signup"
              className="
                hidden lg:inline-flex
                items-center justify-center
                px-4 py-2 rounded-full
                text-sm font-semibold
                bg-[#039751] text-black
                hover:bg-white transition
              "
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= FULLSCREEN MOBILE MENU ================= */}
      <div
        className={`
          fixed inset-0 z-50
          bg-neutral-800/90
          transition-opacity duration-300 ease-out
          ${
            menuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
        style={{ backdropFilter: "blur(6px)" }}
      >
        <div className="flex flex-col pt-28 px-14 max-w-2xl">
          {NAV_LINKS.map(({ label, path }, i) => (
            <Link
              key={path}
              href={path}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => setHoveredItem(path)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                group flex items-center justify-between
                py-4 text-4xl font-bold
                ${
                  pathname === path
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-100"
                }
                transition duration-300
              `}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span>{label}</span>

              <svg
                className={`
                  w-6 h-6 transition-all
                  ${
                    hoveredItem === path
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2"
                  }
                `}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= CLOSE BUTTON ================= */}
      <button
        onClick={() => setMenuOpen(false)}
        aria-label="Close menu"
        className={`
          fixed top-9 left-12 z-[60]
          w-11 h-11 rounded-full
          flex items-center justify-center
          text-gray-400 hover:text-gray-100
          transition-all duration-300
          ${
            menuOpen
              ? "opacity-100 scale-100 delay-[450ms]"
              : "opacity-0 scale-0 pointer-events-none"
          }
        `}
      >
        ✕
      </button>
    </>
  )
}
