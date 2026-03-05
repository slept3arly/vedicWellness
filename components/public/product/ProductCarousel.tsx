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
      <div className="aspect-square w-full rounded-2xl bg-[#0a1a14] border border-white/10 flex items-center justify-center">
        <Package size={48} className="text-white/20" />
      </div>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

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
    <div className="w-full">
      {/* MOBILE LAYOUT */}
      <div className="flex flex-col gap-3 md:hidden w-full">
        {/* MAIN IMAGE */}
        <div
          className="relative h-[220px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a1a14] group focus:outline-none"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${name} image carousel`}
          aria-live="polite"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="relative h-full w-full min-w-full flex-shrink-0"
              >
                <Image
                  src={img}
                  alt={`${name} ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 backdrop-blur-md p-1.5 text-white"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 backdrop-blur-md p-1.5 text-white"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* SHORTER FULL WIDTH THUMBNAILS */}
        <div className="flex w-full gap-2">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Select image ${i + 1}`}
              className={`relative flex-1 h-16 rounded-lg overflow-hidden transition-all duration-200 
                ${
                  i === index
                    ? "ring-2 ring-emerald-500 opacity-100"
                    : "ring-1 ring-white/10 opacity-40"
                }`}
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div
        className="hidden md:grid grid-cols-[55px_1fr] gap-3 
                   h-[320px] 
                   w-full items-stretch max-w-5xl mx-auto"
      >
        {/* SIDEBAR THUMBNAILS */}
        <div className="flex flex-col gap-2 h-full justify-between py-0.5">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Select image ${i + 1}`}
              className={`relative flex-1 w-full rounded-lg overflow-hidden transition-all duration-200 
                ${
                  i === index
                    ? "ring-2 ring-emerald-500 opacity-100"
                    : "ring-1 ring-white/10 opacity-40 hover:opacity-100"
                }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>

        {/* MAIN IMAGE */}
        <div
          className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#0a1a14] group focus:outline-none"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${name} image carousel`}
          aria-live="polite"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="relative h-full w-full min-w-full flex-shrink-0"
              >
                <Image
                  src={img}
                  alt={`${name} ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 backdrop-blur-md p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 backdrop-blur-md p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}