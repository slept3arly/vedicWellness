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

  // Auto play
  useEffect(() => {
    if (slides.length <= 1 || paused) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, interval, paused]);

  if (!slides.length) return null;

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length);
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

  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-[var(--border-soft)] shadow-xl"
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
            >
              {/* Desktop */}
              <Image
                src={slide.imageDesktopUrl}
                alt=""
                fill
                priority={i === 0}
                sizes="(min-width: 768px) 100vw"
                className="hidden md:block object-cover"
              />

              {/* Mobile */}
              <Image
                src={slide.imageMobileUrl}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="block md:hidden object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur px-2 py-2 text-white hover:bg-black/60 transition"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur px-2 py-2 text-white hover:bg-black/60 transition"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-[var(--brand-primary)] scale-125"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
