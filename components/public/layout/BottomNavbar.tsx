"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useMenu } from "@/components/MenuContext";

/* =========================================================
   Shared Motion Classes (FIXED HOVER)
   ========================================================= */
const motionClass = `
  transform-gpu
  transition-transform
  duration-200 ease-out
  hover:scale-110 active:scale-95
  will-change-transform
`;

/* =========================================================
   Reusable Social Link Button
   ========================================================= */
const SocialButton = memo(function SocialButton({
  href,
  ariaLabel,
  iconSrc,
  iconAlt,
  width,
  height,
}: {
  href: string;
  ariaLabel: string;
  iconSrc: string;
  iconAlt?: string;
  width: number;
  height: number;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`
        h-10 w-10
        flex items-center justify-center
        rounded-full
        select-none outline-none
        focus-visible:ring-2 focus-visible:ring-white/70
        origin-center
        ${motionClass}
      `}
    >
      <Image src={iconSrc} alt={iconAlt ?? ""} width={width} height={height} />
    </a>
  );
});

/* =========================================================
   Scroll To Top Button
   ========================================================= */
const ScrollToTopButton = memo(function ScrollToTopButton() {
  const scrollToTop = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={`
        h-11 w-11
        rounded-full
        bg-neutral-900/80 text-white
        backdrop-blur-md
        ring-1 ring-black/10 dark:ring-white/10
        shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.35)]
        flex items-center justify-center
        outline-none
        focus-visible:ring-2 focus-visible:ring-white/70
        origin-center
        ${motionClass}
      `}
    >
      ↑
    </button>
  );
});

/* =========================================================
   Bottom Floating Social Bar + Scroll Top
   ========================================================= */
export default function BottomNavbar() {
  const { menuOpen } = useMenu();

  const [visible, setVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  /* =========================================================
     SCROLL VISIBILITY (RAF optimized)
     ========================================================= */
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const shouldBeVisible = window.scrollY > 100;
      setVisible((prev) => (prev !== shouldBeVisible ? shouldBeVisible : prev));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* =========================================================
     FOOTER DETECTION (NEW)
     ========================================================= */
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.05,
      }
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  const shouldShow = visible && !menuOpen && !footerVisible;

  return (
    <>
      {/* SCROLL TO TOP */}
      <div
        className={`
          fixed bottom-6 md:bottom-8 left-4 z-50
          transition-all duration-300 delay-75
          ${
            shouldShow
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6 pointer-events-none"
          }
        `}
      >
        <ScrollToTopButton />
      </div>

      {/* SOCIAL BAR */}
      <div
        className={`
          fixed bottom-6 md:bottom-8 right-6 z-50
          transition-all duration-300
          ${
            shouldShow
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6 pointer-events-none"
          }
        `}
      >
        <div
          className="
            flex flex-col items-center gap-1
            px-1 py-2
            rounded-full
            bg-neutral-900/80
            backdrop-blur-md
            ring-1 ring-black/10 dark:ring-white/10
            shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_30px_rgba(0,0,0,0.4)]
          "
        >
          <SocialButton
            href="https://wa.me/+919306025799"
            ariaLabel="Chat with us on WhatsApp"
            iconSrc="/whatsapp.svg"
            width={28}
            height={28}
          />
          <SocialButton
            href="https://www.instagram.com/vedic.wellness.official"
            ariaLabel="Visit our Instagram profile"
            iconSrc="/instagram.svg"
            width={34}
            height={34}
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
    </>
  );
}