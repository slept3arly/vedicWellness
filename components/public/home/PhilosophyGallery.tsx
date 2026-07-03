"use client";

import { useState, memo, useCallback } from "react";
import Image from "next/image";
import { LucideIcon, ChevronDown } from "lucide-react";
import Card from "@/components/public/ui/Card";

interface PhilosophyCard {
  title: string;
  summary: string;
  body: string;
  icon: LucideIcon;
  image: string;
}

interface PhilosophyGalleryProps {
  cards: PhilosophyCard[];
  onCardClick?: (card: PhilosophyCard) => void;
}

export default function PhilosophyGallery({
  cards,
  onCardClick,
}: PhilosophyGalleryProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:snap-none md:pb-0">
        {cards.map((item, index) => (
          <div
            key={item.title}
            className="w-[85vw] sm:w-[45vw] md:w-full shrink-0 snap-center snap-always"
          >
            <GalleryCard item={item} index={index} onCardClick={onCardClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface GalleryCardProps {
  item: PhilosophyCard;
  index: number;
  onCardClick?: (card: PhilosophyCard) => void;
}

const GalleryCard = memo(function GalleryCard({
  item,
  index,
  onCardClick,
}: GalleryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = useCallback(() => {
    if (onCardClick) onCardClick(item);
  }, [onCardClick, item]);

  const toggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <Card
      onClick={handleCardClick}
      className="!p-0 h-full flex flex-col overflow-hidden bg-white dark:bg-[#0c0f0e] border-0 dark:border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer transform-gpu"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden p-3 bg-slate-50 dark:bg-zinc-900">
        <div className="w-full h-full relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
            className="object-cover transform-gpu transition-transform duration-300 md:group-hover:scale-[1.02]"
            priority={index < 2}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
            <div className="flex items-center gap-2 text-[color:var(--brand-primary)]">
              <item.icon size={14} className="text-[color:var(--brand-accent)] brightness-125" />
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-300">
                Feature Showcase
              </span>
            </div>
            <h3 className="font-heading font-bold text-base md:text-lg text-white uppercase tracking-wide">
              {item.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow bg-white dark:bg-[#0c0f0e]">
        <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-3 mb-4">
          {item.summary}
        </p>

        <div
          className={`overflow-hidden transform-gpu transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-2 pb-4 text-xs md:text-sm leading-relaxed text-slate-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/50 mt-2">
            {item.body}
          </div>
        </div>

        <button
          onClick={toggleExpand}
          className="mt-auto pt-3 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[color:var(--brand-accent)] hover:brightness-110 transition-all duration-200 select-none w-fit self-start"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "Read Less" : "Read More"}</span>
          <div
            className={`transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronDown size={14} />
          </div>
        </button>
      </div>
    </Card>
  );
});
