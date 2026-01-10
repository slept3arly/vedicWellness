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
      {/* Decorative icon: we rely on aria-label for meaning */}
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
        backdrop-blur
        shadow-lg
        flex items-center justify-center
        cursor-pointer
        transition-transform duration-200
        hover:scale-110 active:scale-95
        text-white
        bg-neutral-800/75
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
   ========================================================= */
export default function BottomNavbar() {
  const { menuOpen } = useMenu()
  const [visible, setVisible] = useState(false)

  /* ---------------------------------------------------------
     Show/Hide widget after scrolling down
     --------------------------------------------------------- */
  useEffect(() => {
    const onScroll = () => {
      const shouldBeVisible = window.scrollY > 100
      setVisible((prev) => (prev !== shouldBeVisible ? shouldBeVisible : prev))
    }

    onScroll() // set initial state
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ---------------------------------------------------------
     If not visible OR menu is open, hide widgets
     --------------------------------------------------------- */
  const shouldShow = visible && !menuOpen

  return (
    <>
      {/* =================================================
          Center Floating Social Action Bar
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
            rounded-full
            shadow-lg
            backdrop-blur-md
            bg-neutral-800/75
          "
        >
          <SocialButton
            href="https://wa.me/917206867795"
            ariaLabel="Chat with us on WhatsApp"
            iconSrc="/whatsapp.svg"
            width={28}
            height={32}
          />

          <SocialButton
            href="https://www.instagram.com/innoviadrugs267?igsh=Y2VqYjhkanFwczFv"
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
