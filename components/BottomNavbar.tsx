"use client"

import type React from "react"

/* =========================
   Imports
   ========================= */
import { motion, AnimatePresence, useScroll } from "framer-motion"
import { useEffect, useState, memo } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

/* =========================
   Reusable Action Button
   ========================= */
const ActionButton = memo(function ActionButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="
        h-8 w-8
        flex items-center justify-center
        rounded-full
        bg-gray-200
        cursor-pointer
        select-none
      "
    >
      {children}
    </motion.a>
  )
})

/* =========================
   Scroll To Top Button
   ========================= */
const ScrollToTopButton = memo(function ScrollToTopButton({
  isDark,
}: {
  isDark: boolean
}) {
  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Scroll to top"
      className={`
        h-10 w-10
        rounded-full
        backdrop-blur
        shadow-lg
        flex items-center justify-center
        cursor-pointer
        transition-colors duration-300
        ${isDark ? "bg-gray-400/80 text-white" : "bg-gray-800/80 text-white"}
      `}
    >
      ↑
    </motion.button>
  )
})

/* =========================
   Bottom Navbar Component
   ========================= */
export default function BottomNavbar() {
  const { scrollY } = useScroll()
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === "dark"

  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  /* Prevent hydration mismatch */
  useEffect(() => {
    setMounted(true)
  }, [])

  /* Toggle visibility based on scroll position */
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setVisible((prev) => {
        const next = y > 400
        return prev !== next ? next : prev
      })
    })

    return () => unsubscribe()
  }, [scrollY])

  /* Avoid rendering until mounted */
  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* =========================
              Center Floating Action Bar
             ========================= */}
          <motion.div
            key="bottom-bar"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              mass: 1.1,
            }}
            className={`
              fixed bottom-6 inset-x-0 z-50
              flex items-center justify-center
            `}
          >
            <div
              className={`
                flex items-center gap-4
                px-3 py-3
                rounded-full
                shadow-lg
                backdrop-blur-md
                transition-colors duration-300
                ${isDark ? "bg-gray-400/80" : "bg-gray-800/80"}
              `}
            >
              <ActionButton href="https://wa.me/919466835259">
                <Image src="/whatsapp.png" alt="WhatsApp" width={22} height={22} priority={false} />
              </ActionButton>

              <ActionButton href="tel:+919466835259">
                <Image src="/phone.png" alt="Call" width={22} height={22} />
              </ActionButton>

              <ActionButton href="https://www.facebook.com/innoviadrugs267/">
                <Image src="/facebook.png" alt="Facebook" width={22} height={22} />
              </ActionButton>
            </div>
          </motion.div>

          {/* =========================
              Scroll To Top Button
             ========================= */}
          <motion.div
            key="scroll-top"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              mass: 1.1,
              delay: 0.05,
            }}
            className="fixed bottom-8 right-6 z-50"
          >
            <ScrollToTopButton isDark={isDark} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
