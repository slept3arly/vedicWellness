"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Button from "@/components/public/ui/Button";
import { softSpring, fastSpring } from "@/app/animations";
import Image from "next/image";

type Banner = {
  id: string;
  type: "IMAGE_ONLY" | "TEXT";
  title?: string | null;
  message?: string | null;
  imageUrl?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: { scale: 0.93, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: softSpring,
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 12,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const closeBtnVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...softSpring, delay: 0.2 },
  },
  exit: { opacity: 0, y: 4, transition: { duration: 0.12 } },
};

function CloseIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M11 3L3 11M3 3L11 11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PromotionModal({ banner }: { banner: Banner | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!banner) return;
    const dismissed = sessionStorage.getItem(`banner-session-${banner.id}`);
    if (!dismissed) setOpen(true);
  }, [banner]);

  // Scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    if (banner) sessionStorage.setItem(`banner-session-${banner.id}`, "1");
    setOpen(false);
  }

  function handleCTA() {
    if (!banner) return;
    sessionStorage.setItem(`banner-session-${banner.id}`, "1");
    setOpen(false);
    if (banner.buttonLink) router.push(banner.buttonLink);
  }

  if (!banner) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 p-4 bg-black/65 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={close}
        >
          {/* ── Modal card ──
              Mobile : narrow + tall (phone poster feel)    → max-w-[400px], no aspect ratio
              Desktop: wide 16:9 cinematic banner           → sm:max-w-[780px] + sm:aspect-video

              FIX: replaced rounded-[inherit] with explicit rounded-2xl + overflow-hidden
              so corners are clipped on both mobile and desktop.
          */}
          <motion.div
            className="promo-inner relative w-full max-w-[400px] sm:max-w-[780px] rounded-2xl overflow-hidden"
            style={{ minHeight: "clamp(460px, 65vh, 640px)" }}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={banner.title ? "promo-title" : undefined}
          >
            {/* ── IMAGE ONLY mode ── */}
            {banner.type === "IMAGE_ONLY" && banner.imageUrl && (
              // overflow-hidden on parent already clips this; w-full h-full fills the container
              <Image
                src={banner.imageUrl}
                alt="Promotion"
                priority
                sizes="(max-width: 640px) 100vw, 780px"
                className="block w-full h-full object-cover"
              />
            )}

            {/* ── TEXT mode ── */}
            {banner.type === "TEXT" && (
              <div className="relative w-full h-full min-h-[460px] sm:min-h-0 sm:aspect-video">
                {/* Background image */}
                {banner.imageUrl && (
                  <Image
                    src={banner.imageUrl}
                    alt=""
                    aria-hidden
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 780px"
                    className="object-cover object-center"                  />
                )}

                {/* Gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5 pointer-events-none" />

                {/* Content pinned to bottom */}
                <div className="absolute inset-0 flex flex-col justify-end px-6 pb-7 sm:px-8 sm:pb-8">
                  <div className="flex flex-col gap-1.5 mb-5">
                    {banner.title && (
                      <h2
                        id="promo-title"
                        className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug m-0 text-white"
                      >
                        {banner.title}
                      </h2>
                    )}
                    {banner.message && (
                      <p className="text-sm sm:text-base leading-relaxed m-0 text-white/70">
                        {banner.message}
                      </p>
                    )}
                  </div>

                  {/* CTA row */}
                  {banner.buttonText && banner.buttonLink && (
                    <div className="flex flex-row items-stretch gap-3">
                      <Button
                        onClick={handleCTA}
                        variant="primary"
                        className="flex-1"
                      >
                        {banner.buttonText}
                      </Button>
                      <Button
                        onClick={close}
                        variant="secondary"
                        className="flex-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20 hover:!border-white/30"
                      >
                        Maybe later
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* ── External close button below card ── */}
          <motion.button
            className="flex items-center
            gap-2 px-6 py-2.5 rounded-full
            text-sm font-medium text-white/60 hover:text-white
            border border-white/15 hover:border-white/35
            bg-black/45 hover:bg-white/10 transition-colors
            cursor-pointer select-none"
            variants={closeBtnVariants}
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close promotion"
            whileTap={{ scale: 0.96 }}
            transition={fastSpring}
          >
            <CloseIcon />
            <span>Close</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}