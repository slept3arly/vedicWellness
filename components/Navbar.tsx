"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Blogs", path: "/blogs" },
  { label: "About", path: "/about" },
  { label: "Our Products", path: "/products" },
  { label: "Contact Us", path: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const { resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = resolvedTheme || systemTheme || "light"
  const [scrollY, setScrollY] = useState(0)

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

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const scrolled100 = scrollY > 100

  return (
    <>
      <nav
        className={`
          fixed z-50 left-1/2 -translate-x-1/2
          transition-all duration-500 ease-in-out px-2
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
            className="flex flex-col items-start gap-0.5 font-bold tracking-tight text-lg md:text-xl lg:text-2xl whitespace-nowrap"
            onClick={() => {
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            }}
          >
            <img
              src="/logo.svg"
              alt="Vedic Wellness"
              className="h-[52px] w-auto brightness-125"
              draggable={false}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 text-base font-medium">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                prefetch
                className={`relative pb-1 transition-colors ${
                  pathname === path
                    ? "text-white"
                    : theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-300 hover:text-gray-900"
                }`}
              >
                {label}
                {pathname === path && (
                  <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            <div className={`space-y-1.5 transition-all ${mobileOpen ? "opacity-70" : ""}`}>
              <span className={`block h-0.5 w-6 bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-1" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all ${mobileOpen ? "-rotate-45 -translate-y-1" : ""}`} />
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
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                prefetch
                onClick={() => setMobileOpen(false)}
                className={`text-base font-medium transition-colors ${
                  pathname === path
                    ? "text-emerald-400"
                    : theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
