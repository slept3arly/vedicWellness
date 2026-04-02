"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

export default function ProductCarousel({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = images.length;

  if (!total) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <Package size={48} className="text-zinc-300 dark:text-zinc-600" aria-hidden="true" />
      </div>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div
      className="relative h-full w-full overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${name} product images`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 50) next();
        if (diff < -50) prev();
        touchStartX.current = null;
      }}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
        style={{ transform: `translateX(-${index * 100}%)` }}
        aria-live="polite"
        aria-atomic="true"
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative h-full w-full min-w-full shrink-0"
            aria-hidden={i !== index}
          >
            <Image
              src={img}
              alt={i === 0 ? name : `${name} — view ${i + 1}`}
              fill
              priority={i === 0}
              placeholder="empty"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Arrows — always visible on mobile, hover-reveal on desktop */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="
              absolute left-3 top-1/2 -translate-y-1/2 z-20
              h-9 w-9 rounded-full flex items-center justify-center
              bg-black/40 backdrop-blur-sm text-white
              opacity-100 md:opacity-0 md:group-hover:opacity-100
              transition-opacity duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
            "
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="
              absolute right-3 top-1/2 -translate-y-1/2 z-20
              h-9 w-9 rounded-full flex items-center justify-center
              bg-black/40 backdrop-blur-sm text-white
              opacity-100 md:opacity-0 md:group-hover:opacity-100
              transition-opacity duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
            "
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </>
      )}

      {/* Dot indicators at bottom */}
      {total > 1 && (
        <div
          className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20"
          role="tablist"
          aria-label="Image navigation"
        >
          {images.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Image ${i + 1} of ${total}`}
              onClick={() => setIndex(i)}
              className={`
                h-1.5 rounded-full transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                ${i === index ? "w-5 bg-emerald-500" : "w-1.5 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400"}
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}