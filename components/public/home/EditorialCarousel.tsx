"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface CarouselSlide {
  src: string;
  alt: string;
  title: string;
  body: string;
  number: string;
}

const slides: CarouselSlide[] = [
  {
    src: "/hero/1.webp",
    alt: "Vedic Wellness Ayurvedic manufacturing facility with traditional herb processing",
    title: "Rooted in Tradition",
    body: "We begin with classical Ayurvedic texts and time-tested botanical principles, then shape them into practical formulations that preserve traditional intent while meeting modern pharmaceutical standards. This keeps heritage at the center of the portfolio while supporting the consistency required for everyday use.",
    number: "01",
  },
  {
    src: "/hero/4.webp",
    alt: "Quality control laboratory testing Ayurvedic formulations",
    title: "Science-Driven Quality",
    body: "Every formulation is developed and produced through documented quality checkpoints in GMP-certified manufacturing environments. Batch controls and testing support purity, potency, and dependable consistency across the products our partners take to market.",
    number: "02",
  },
  {
    src: "/hero/7.webp",
    alt: "Finished Ayurvedic wellness products ready for distribution",
    title: "Comprehensive Portfolio",
    body: "Our 200+ product range spans classical rasayanas, modern wellness formats, general health tonics, digestive and liver care, personal care, and daily supplements. The breadth of the portfolio gives partners practical options for serving varied customer needs across categories.",
    number: "03",
  },
  {
    src: "/hero/8.webp",
    alt: "Vedic Wellness franchise partners collaborating in regional office",
    title: "Partner Success",
    body: "More than 500 franchise partners across India benefit from exclusive monopoly territories, promotional materials, visual aids, timely dispatch, and dedicated business guidance. The model is designed to give local teams a clearer foundation for building sustainable distribution networks.",
    number: "04",
  },
  {
    src: "/hero/9.webp",
    alt: "Botanical ingredients sourced for Vedic Wellness formulations",
    title: "Authentic Sourcing",
    body: "We work with certified farms and forest collectors to source authenticated botanicals with traceability through the supply chain. That sourcing discipline gives our formulations a clearer connection to their ingredients and supports the quality standards expected of the finished portfolio.",
    number: "05",
  },
];

const SLIDE_INTERVAL = 3500;
const INTRODUCTION = "Five principles that define how we formulate, manufacture, and grow.";

export default function EditorialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerReset, setTimerReset] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);

    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const timer = window.setTimeout(() => {
      setCurrentIndex((index) => (index + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearTimeout(timer);
  }, [currentIndex, reducedMotion, timerReset]);

  function selectSlide(index: number) {
    setCurrentIndex(index);
    setTimerReset((value) => value + 1);
  }

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="mx-auto w-full max-w-7xl min-w-0"
      role="region"
      aria-roledescription="carousel"
      aria-label="Vedic Wellness philosophy carousel"
    >
      <div className="grid min-w-0 items-center gap-x-6 gap-y-5 md:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:gap-x-12">
        <div className="order-2 min-w-0 md:col-start-2 md:row-start-1">
          <p className="max-w-xl font-body text-base leading-relaxed text-slate-600 dark:text-slate-300 lg:text-lg">
            {INTRODUCTION}
          </p>
        </div>

        <div className="order-1 min-w-0 md:col-start-1 md:row-span-3 md:row-start-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-[var(--bg-surface)]">
            {slides.map((slide, index) => (
              <div
                key={slide.src}
                className={cn(
                  "absolute inset-0 transition-opacity duration-300 ease-out md:duration-500 motion-reduce:transition-none",
                  index === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
                )}
                aria-hidden={index !== currentIndex}
              >
                <Image
                  src={slide.src}
                  alt={index === currentIndex ? slide.alt : ""}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1280px) 40vw, (min-width: 768px) 38vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="philosophy-thumbnail-rail order-3 flex min-w-0 w-full max-w-full gap-2 overflow-x-scroll px-2 pb-3 pt-2 md:col-start-2 md:row-start-2 md:mt-1 md:overflow-x-visible md:p-0"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to ${slide.number}: ${slide.title}`}
              onClick={() => selectSlide(index)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg transition-opacity duration-300 md:h-14 md:w-auto md:flex-1 md:shrink lg:h-16",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2",
                index === currentIndex
                  ? "opacity-100 ring-2 ring-[var(--brand-accent)]"
                  : "opacity-[.55] hover:opacity-[.85]"
              )}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
              <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1 text-[0.6rem] font-semibold text-white">
                {slide.number}
              </span>
              <span className="sr-only">{slide.title}</span>
            </button>
          ))}
        </div>

        <div className="order-4 min-h-[270px] min-w-0 px-4 md:col-start-2 md:row-start-3 md:min-h-[245px] md:px-0 sm:px-5" aria-live="polite">
          <div key={currentSlide.number} className="philosophy-copy-transition">
            <p className="font-display text-3xl font-semibold leading-none tracking-tight text-[var(--brand-primary)] dark:text-[#84eb4b] sm:text-4xl">
              {currentSlide.number}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {currentSlide.title}
            </h2>
            <p className="mt-3 max-w-lg font-body text-base leading-relaxed text-slate-600 dark:text-slate-300 lg:text-lg">
              {currentSlide.body}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes philosophy-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .philosophy-copy-transition { animation: none; }

        @media (min-width: 768px) {
          .philosophy-copy-transition {
            animation: philosophy-fade 420ms ease-out both;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .philosophy-copy-transition {
            animation: none;
          }
        }

        .philosophy-thumbnail-rail {
          scrollbar-width: auto;
          scrollbar-gutter: stable;
        }

        @media (min-width: 768px) {
          .philosophy-thumbnail-rail {
            scrollbar-width: auto;
            scrollbar-gutter: auto;
          }
        }
      `}</style>
    </div>
  );
}
