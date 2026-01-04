"use client"

/* ===================== Imports ===================== */
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useTheme } from "next-themes"
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useReducedMotion } from "framer-motion"

/* ===================== Constants ===================== */

// Navigation links
const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Blogs", path: "/blogs" },
  { label: "About", path: "/about" },
  { label: "Products", path: "/products" },
  { label: "Contact", path: "/contact" },
]

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
  open: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
}

const mobileMenuItemVariants = {
  closed: { opacity: 0, y: -5 },
  open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

/* ===================== Component ===================== */

export default function Navbar() {
  /* ---------- Router / Path ---------- */
  const pathname = usePathname()
  const router = useRouter()

  /* ---------- Theme ---------- */
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  /* ---------- State ---------- */
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  /* ---------- Scroll Animations ---------- */
  const { scrollY } = useScroll()
  const prefersReducedMotion = useReducedMotion()

  const rawScale = useTransform(scrollY, [0, 100], [1, 0.85])
  const rawTop = useTransform(scrollY, [0, 100], [0, 25])

  const springConfig = useMemo(
    () => ({
      stiffness: prefersReducedMotion ? 120 : 260,
      damping: prefersReducedMotion ? 25 : 24,
      mass: 0.8,
    }),
    [prefersReducedMotion],
  )

  const scale = useSpring(rawScale, springConfig)
  const top = useSpring(rawTop, springConfig)

  /* ===================== Handlers ===================== */

  // Smart navigation handler (scroll to top if already on page)
  const handleNav = useCallback(
    (path: string) => {
      if (pathname === path) {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        router.push(path)
      }
      setMenuOpen(false) // Close menu on navigation
    },
    [pathname, router],
  )

  const linkClass = useCallback(
    (path: string) => (pathname === path ? "text-white font-semibold" : "text-gray-300 hover:text-white"),
    [pathname],
  )

  /* ===================== Effects ===================== */

  // Prefetch routes
  useEffect(() => {
    NAV_LINKS.forEach(({ path }) => {
      router.prefetch(path)
    })
  }, [router])

  useEffect(() => {
    let last = false
    let ticking = false

    const unsubscribe = scrollY.on("change", (y) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const next = y > 80
          if (next !== last) {
            last = next
            setScrolled(next)
          }
          ticking = false
        })
        ticking = true
      }
    })

    return unsubscribe
  }, [scrollY])

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Prevent hydration mismatch (next-themes)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  /* ===================== Render ===================== */

  return (
    <motion.nav
      style={{
        scaleX: scale,
        top,
        willChange: scrolled ? "transform" : "auto",
      }}
      animate={{
        borderRadius: scrolled ? "35px" : "0px",
        height: menuOpen ? "300px" : scrolled ? "65px" : "75px",
        paddingTop: scrolled ? "15px" : "20px",
        paddingBottom: scrolled ? "15px" : "20px",
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 24,
        mass: 0.8,
      }}
      className={`
        fixed left-1/2 -translate-x-1/2 z-50
        flex flex-col md:flex-row md:items-center
        justify-between overflow-hidden
        transition-colors duration-300
        w-full md:w-[90vw]
        ${isDark ? "bg-gray-400/80 md:backdrop-blur" : "bg-gray-800/80 md:backdrop-blur"}
        backdrop-blur-sm md:backdrop-blur
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
          <div className="text-[8px] mt-1.5 px-7 uppercase tracking-widest text-green-400">
            A Division of Innovia Drugs
          </div>
        </motion.button>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen((prev) => !prev)} className="md:hidden px-4" aria-label="Toggle menu">
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNav(path)}
              className={`relative pb-1 ${linkClass(path)}`}
            >
              {label}
              {pathname === path && (
                <motion.div
                  layoutId="navbar-underline"
                  className="absolute left-0 right-0 -bottom-1 h-[2px] bg-green-400 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col md:hidden items-start justify-start gap-2 px-8 py-6"
          >
            {NAV_LINKS.map(({ label, path }) => (
              <motion.button
                key={path}
                variants={mobileMenuItemVariants}
                onClick={() => handleNav(path)}
                className={`text-lg ${pathname === path ? "text-white font-semibold" : "text-gray-300"}`}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
