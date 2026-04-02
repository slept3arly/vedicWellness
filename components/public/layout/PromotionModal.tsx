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

  /* ========================================================= */
  /* HYDRATION-SAFE STATE */
  /* ========================================================= */

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  /* Mount detection */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* Banner logic (after hydration only) */
  useEffect(() => {
    if (!mounted || !banner) return;

    const dismissed = sessionStorage.getItem(`banner-session-${banner.id}`);
    setOpen(!dismissed);
  }, [mounted, banner?.id]);

  /* ========================================================= */
  /* SCROLL LOCK */
  /* ========================================================= */

  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  /* ========================================================= */
  /* ACTIONS */
  /* ========================================================= */

  function close() {
    if (banner) {
      sessionStorage.setItem(`banner-session-${banner.id}`, "1");
    }
    setOpen(false);
  }

  function handleCTA() {
    if (!banner) return;

    sessionStorage.setItem(`banner-session-${banner.id}`, "1");
    setOpen(false);

    if (banner.buttonLink) {
      router.push(banner.buttonLink);
    }
  }

  /* ========================================================= */
  /* PREVENT HYDRATION MISMATCH */
  /* ========================================================= */

  if (!mounted || !banner) return null;

  /* ========================================================= */
  /* RENDER */
  /* ========================================================= */

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
          {/* Modal Card */}
          <motion.div
            className="promo-inner relative w-full max-w-[400px] sm:max-w-[780px] rounded-2xl overflow-hidden"
            style={{ minHeight: "clamp(460px, 65vh, 640px)" }}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={banner.title ? "promo-title" : undefined}
          >
            {/* IMAGE ONLY */}
            {banner.type === "IMAGE_ONLY" && banner.imageUrl && (
              <div className="relative w-full h-full">
              <Image
                src={banner.imageUrl}
                alt="Promotion banner"
                fill
                sizes="(max-width: 640px) 100vw, 780px"
                className="object-cover"
              />
              </div>
            )}

            {/* TEXT MODE */}
            {banner.type === "TEXT" && (
              <div className="relative w-full h-full min-h-[460px] sm:min-h-0 sm:aspect-[16/9]">
                {/* Background */}
                {banner.imageUrl && (
                  <Image
                    src={banner.imageUrl}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 640px) 100vw, 780px"
                    className="object-cover object-center"
                  />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5 pointer-events-none" />

                {/* Content */}
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

                  {/* CTA */}
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

          {/* Close button */}
          <motion.button
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white/60 hover:text-white border border-white/15 hover:border-white/35 bg-black/45 hover:bg-white/10 transition-colors cursor-pointer select-none"
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