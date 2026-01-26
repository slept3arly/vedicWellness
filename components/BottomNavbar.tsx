"use client"

import React, { memo, useEffect, useState } from "react"
import Image from "next/image"
import { useMenu } from "@/components/MenuContext"

/* =========================================================
   Reusable Social Link Button (Accessible)
   ========================================================= */
const SocialButton = memo(function SocialButton({
  href,
  ariaLabel,
  iconSrc,
  iconAlt,
  width,
  height,
}: {
  href: string
  ariaLabel: string
  iconSrc: string
  iconAlt?: string
  width: number
  height: number
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="
        h-9 w-8
        flex items-center justify-center
        rounded-full
        cursor-pointer select-none
        transition-transform duration-200
        hover:scale-110 active:scale-95
      "
    >
      <Image src={iconSrc} alt={iconAlt ?? ""} width={width} height={height} />
    </a>
  )
})

/* =========================================================
   Scroll To Top Button (Accessible)
   ========================================================= */
const ScrollToTopButton = memo(function ScrollToTopButton() {
  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="
        h-10 w-10
        rounded-full
        bg-neutral-900/75  -md shadow-lg
        flex items-center justify-center
        cursor-pointer
        will-change: transform
        transition-transform duration-200
        hover:scale-110 active:scale-95
        text-white
      "
    >
      ↑
    </button>
  )
})

/* =========================================================
   Bottom Floating Social Bar + Scroll Top
   - Appears after user scrolls down
   - Hides when fullscreen menu is open
   - NEW: hides near bottom (mobile only)
   ========================================================= */
export default function BottomNavbar() {
  const { menuOpen } = useMenu()

  const [visible, setVisible] = useState(false)
  const [nearBottomMobile, setNearBottomMobile] = useState(false)

  useEffect(() => {
    const BOTTOM_OFFSET = 60 // px: "near bottom" threshold
    const MOBILE_QUERY = "(max-width: 768px)"

    const isMobile = () => window.matchMedia(MOBILE_QUERY).matches

    const check = () => {
      // show/hide after scroll
      const shouldBeVisible = window.scrollY > 100
      setVisible((prev) => (prev !== shouldBeVisible ? shouldBeVisible : prev))

      // near-bottom hide (mobile only)
      if (isMobile()) {
        const scrollPos = window.scrollY + window.innerHeight
        const docHeight = document.documentElement.scrollHeight
        const isNearBottom = docHeight - scrollPos <= BOTTOM_OFFSET

        setNearBottomMobile((prev) => (prev !== isNearBottom ? isNearBottom : prev))
      } else {
        // ensure it never hides on desktop due to this rule
        setNearBottomMobile(false)
      }
    }

    check() // initial state
    window.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check, { passive: true })

    return () => {
      window.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
    }
  }, [])

  // if not visible OR menu open OR near bottom on mobile => hide
  const shouldShow = visible && !menuOpen && !nearBottomMobile

  return (
    <>
      {/* =================================================
          Side Floating Social Action Bar
         ================================================= */}
      <div
        className={`
          fixed bottom-6 right-5 z-50
          flex items-center justify-center
          transition-all duration-300
          ${shouldShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
        `}
      >
        <div
          className="
            flex flex-col items-center gap-2
            px-2 py-2
            rounded-full w-auto h-auto
            bg-neutral-900/75  -md shadow-lg
          "
        >
          <SocialButton
            href="https://wa.me/+919306025799"
            ariaLabel="Chat with us on WhatsApp"
            iconSrc="/whatsapp.svg"
            width={26}
            height={26}
          />

          <SocialButton
            href="https://www.instagram.com/vedic.wellness.official"
            ariaLabel="Visit our Instagram profile"
            iconSrc="/instagram.svg"
            width={32}
            height={32}
          />

          <SocialButton
            href="https://www.facebook.com/vedicwellnessid/"
            ariaLabel="Visit our Facebook page"
            iconSrc="/facebook.svg"
            width={26}
            height={26}
          />
        </div>
      </div>

      {/* =================================================
          Scroll To Top Button
         ================================================= */}
      <div
        className={`
          fixed bottom-44 right-6 z-50
          transition-all duration-300 delay-75
          ${shouldShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
        `}
      >
        <ScrollToTopButton />
      </div>
    </>
  )
}
