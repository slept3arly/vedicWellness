"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id: string;
  imageDesktopUrl: string;
  imageMobileUrl: string;
};

type Props = {
  slides: Slide[];
  interval?: number;
};

export default function MediaSlider({
  slides,
  interval = 5000,
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;

  // Auto play
  useEffect(() => {
    if (total <= 1 || paused) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, interval);

    return () => clearInterval(timer);
  }, [total, interval, paused]);

  if (!total) return null;

  function prev() {
    setIndex((i) => (i - 1 + total) % total);
  }

  function next() {
    setIndex((i) => (i + 1) % total);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50) next();
    if (diff < -50) prev();

    touchStartX.current = null;
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }

  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-[var(--border-soft)] shadow-xl focus:outline-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional image carousel"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Responsive aspect ratio wrapper */}
      <div className="relative w-full aspect-[4/5] md:aspect-[16/9]">

        <div
          className="flex h-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="relative h-full w-full flex-shrink-0"
              aria-hidden={i !== index}
            >
              {/* Desktop */}
              <Image
                src={slide.imageDesktopUrl}
                alt={`Slide ${i + 1} of ${total}`}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 1200px"
                className="hidden md:block object-cover"
              />

              {/* Mobile */}
              <Image
                src={slide.imageMobileUrl}
                alt={`Slide ${i + 1} of ${total}`}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="block md:hidden object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur px-2 py-2 text-white hover:bg-black/60 transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur px-2 py-2 text-white hover:bg-black/60 transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] ${
                i === index
                  ? "bg-[var(--brand-primary)] scale-125"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}