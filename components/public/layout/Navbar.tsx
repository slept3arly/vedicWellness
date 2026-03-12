"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, User } from "lucide-react"
import { useMenu } from "@/components/MenuContext"

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Contact Us", path: "/contact" },
  { label: "Our Products", path: "/products" },
  { label: "Blogs", path: "/blogs" },
  { label: "About", path: "/about" },
]

export default function Navbar() {
  const pathname = usePathname()
  const activePath = pathname
  const { menuOpen, setMenuOpen } = useMenu()
  const { data: session, status } = useSession()

  const role = session?.user?.role ?? null
  const isAdmin = role === "ADMIN"
  const isAuthenticated = !!role

  /* ✅ Better scroll lock */
  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", menuOpen)
    return () => {
      document.documentElement.classList.remove("overflow-hidden")
    }
  }, [menuOpen])

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`
          fixed z-40
          top-3 left-3 right-3 h-16 pb-1
          lg:h-20 lg:top-5 lg:left-9 lg:right-9
          backdrop-blur-lg
          bg-neutral-900/75 shadow-lg
          rounded-lg
          will-change-transform
        `}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full px-4 lg:px-8">

          {/* LEFT */}
          <div className="flex items-center gap-6 pt-1">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden flex items-center h-8 px-2 rounded text-gray-300"
            >
              <span className="relative block w-5 h-4">
                <span className="absolute top-0 left-0 w-6 h-0.5 bg-current" />
                <span className="absolute top-1 left-0 w-6 h-0.5 translate-y-0.5 bg-current" />
                <span className="absolute top-3 left-0 w-6 h-0.5 bg-current" />
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-6 text-base font-medium text-gray-300">
              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  href={path}
                  prefetch={false}
                  className={`hover:text-white ${
                    activePath === path ? "text-emerald-500" : ""
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* CENTER LOGO */}
          <div className="flex justify-center">
            <Link href="/" prefetch={false} onClick={() => setMenuOpen(false)}>
              <Image
                src="/logo.svg"
                alt="Vedic Wellness"
                width={160}
                height={52}
                sizes="160px"
                priority
                className="h-[40px] w-auto brightness-150 lg:h-[48px]"
              />
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-2 pt-1">
            {status === "loading" ? null : !isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="bg-[#84eb4b] px-4 py-2 text-sm font-medium text-gray-900 rounded hover:bg-white"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="hidden lg:inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-[#039751] text-black hover:bg-white transition"
                >
                  Sign Up
                </Link>
              </>
            ) : isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className="bg-[#84eb4b] px-4 py-2 text-sm font-medium text-gray-900 rounded hover:bg-white"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hidden lg:inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-[#039751] text-black hover:bg-white transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/cart"
                  className="w-10 h-10 rounded-full bg-[#84eb4b] dark:text-black flex items-center justify-center hover:bg-white transition"
                  aria-label="Go to cart"
                >
                  <ShoppingCart size={20} />
                </Link>

                <Link
                  href="/account"
                  className="w-10 h-10 rounded-full bg-[#84eb4b] dark:text-black flex items-center justify-center hover:bg-white transition"
                  aria-label="My account"
                >
                  <User size={20} />
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hidden lg:inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-[#039751] text-black hover:bg-white transition"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ================= MOBILE FULLSCREEN MENU ================= */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`
          fixed inset-0 z-50
          bg-neutral-800/90
          transition-opacity duration-300
          ${
            menuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
        style={{ backdropFilter: "blur(6px)" }}
      >
        <div className="flex flex-col pt-28 px-14 max-w-2xl text-center">
          {NAV_LINKS.map(({ label, path }, i) => (
            <Link
              key={path}
              href={path}
              prefetch={false}
              onClick={() => setMenuOpen(false)}
              className={`
                group flex items-center justify-between
                py-3 text-3xl font-bold
                ${
                  activePath === path
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-100"
                }
                transition duration-300
              `}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span>{label}</span>

              {/* ✅ Pure CSS hover animation — no state */}
              <svg
                className="w-6 h-6 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}

          {isAuthenticated && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="
                mt-12
                py-3 text-3xl font-bold
                text-gray-400 hover:text-gray-100
                transition duration-300
                text-right
              "
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setMenuOpen(false)}
        aria-label="Close menu"
        className={`
          fixed top-6 left-6 z-[60]
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