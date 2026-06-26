"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

export interface FanCarouselItem {
    title: string;
    summary: string;
    body: string;
    image: string;
    icon: LucideIcon;
}

interface FanCarouselProps {
    items: FanCarouselItem[];
    onCardOpen?: (item: FanCarouselItem) => void;
}

const premiumEase = [0.22, 1, 0.36, 1] as const;

export default function FanCarousel({
    items,
    onCardOpen,
}: FanCarouselProps) {
    const [centerIndex, setCenterIndex] = useState(1);
    const [isDragging, setIsDragging] = useState(false);

    const totalCards = items.length;

    const visibleCards = useMemo(() => {
        const prevIndex = (centerIndex - 1 + totalCards) % totalCards;
        const nextIndex = (centerIndex + 1) % totalCards;

        return [
            { item: items[prevIndex], index: prevIndex, position: "prev" },
            { item: items[centerIndex], index: centerIndex, position: "center" },
            { item: items[nextIndex], index: nextIndex, position: "next" },
        ];
    }, [centerIndex, items, totalCards]);

    const getMobileFanStyles = (position: string) => {
        switch (position) {
            case "center":
                return {
                    rotate: 0,
                    zIndex: 30,
                    scale: 1.05,
                    y: -10,
                    x: 0,
                };

            case "prev":
                return {
                    rotate: -8,
                    zIndex: 20,
                    scale: 0.92,
                    y: 10,
                    x: -35,
                };

            case "next":
                return {
                    rotate: 8,
                    zIndex: 20,
                    scale: 0.92,
                    y: 10,
                    x: 35,
                };

            default:
                return {
                    rotate: 0,
                    scale: 0.8,
                    opacity: 0,
                };
        }
    };

    const handleCardClick = (index: number) => {
        if (isDragging) return;

        if (index === centerIndex) {
            onCardOpen?.(items[index]);
        } else {
            setCenterIndex(index);
        }
    };

    return (
        <div className="w-full">

            {/* Desktop Rail */}

            <div className="carousel-scrollbar hidden md:flex overflow-y-visible pt-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 gap-6 w-full">
                {items.map((item) => (
                    <motion.div
                        key={item.title}
                        whileHover={{ scale: 1.015 }}
                        transition={{
                            duration: 0.28,
                            ease: premiumEase,
                        }}
                        onClick={() => onCardOpen?.(item)}
                        className="snap-start shrink-0 cursor-pointer w-[290px] lg:w-[320px]"
                    >
                        <Card className="!p-0 overflow-hidden bg-white dark:bg-[#0c0f0e] border-0 shadow-md">
                            <div className="relative aspect-[3/4] w-full overflow-hidden p-3 bg-slate-50 dark:bg-zinc-900">

                                <div className="w-full h-full relative rounded-xl overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(min-width: 1024px) 320px, 290px"
                                        className="object-cover"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 z-10 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <item.icon
                                            size={16}
                                            className="text-[color:var(--brand-accent)]"
                                        />
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                                            View Details
                                        </span>
                                    </div>

                                    <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wide">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-slate-300 line-clamp-1">
                                        {item.summary}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Mobile Fan */}

            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.08}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(e, info) => {
                    setTimeout(() => setIsDragging(false), 50);

                    if (info.offset.x > 80) {
                        setCenterIndex(
                            (prev) => (prev - 1 + totalCards) % totalCards
                        );
                    }

                    if (info.offset.x < -80) {
                        setCenterIndex(
                            (prev) => (prev + 1) % totalCards
                        );
                    }
                }}
                className="md:hidden relative flex justify-center items-center h-[430px] w-full select-none touch-pan-y"
            >
                {visibleCards.map(({ item, index, position }) => {
                    const styles = getMobileFanStyles(position);
                    const isCenter = position === "center";

                    return (
                        <motion.div
                            key={`${item.title}-${position}`}
                            animate={styles}
                            transition={{
                                duration: 0.24,
                                ease: premiumEase,
                            }}
                            onClick={() => handleCardClick(index)}
                            className="absolute cursor-pointer origin-bottom w-[265px] sm:w-[290px] transform-gpu"
                            style={{
                                willChange: "transform",
                                contain: "layout paint",
                            }}
                        >
                            <Card
                                className={`!p-0 overflow-hidden border-0 ${isCenter
                                        ? "shadow-[0_12px_30px_rgba(2,101,54,0.20)]"
                                        : "shadow-md brightness-[0.88]"
                                    }`}
                            >
                                <div className="relative aspect-[3/4] w-full overflow-hidden p-3">

                                    <div className="w-full h-full relative rounded-xl overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            sizes="265px"
                                            className="object-cover"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6 z-10 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <item.icon
                                                size={16}
                                                className="text-[color:var(--brand-accent)]"
                                            />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                                                {isCenter ? "Active Module" : "View Details"}
                                            </span>
                                        </div>

                                        <h3 className="font-heading font-bold text-base text-white uppercase tracking-wide">
                                            {item.title}
                                        </h3>

                                        <p className="text-xs text-slate-300 line-clamp-1">
                                            {item.summary}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
