"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  images: string[];
  interval?: number;
};

export default function MediaSlider({ images, interval = 4500 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      interval
    );

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[var(--border-soft)] shadow-xl">
      {/* Fixed-height wrapper prevents CLS */}
      <div className="relative h-[440px] w-full">
        <div
          className="flex h-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="relative h-full w-full flex-shrink-0">
              <Image
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-transform ${
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
