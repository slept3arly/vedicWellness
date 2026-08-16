"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import Image from "next/image";
import {
  BadgeCheck,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  ChevronDown,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";

// --- DATA STRUCTURES ---
const featureCards = [
  {
    id: "who-we-are",
    title: "Who We Are",
    body: "Vedic Wellness combines Ayurvedic expertise with modern manufacturing standards to build scalable, high-quality wellness portfolios.",
    icon: Leaf,
  },
  {
    id: "ayurveda-growth",
    title: "Why Ayurveda is Growing",
    body: "Demand for natural preventive healthcare continues to rise, creating strong opportunities for sustainable growth in Ayurvedic markets.",
    icon: Sparkles,
  },
];

const interactiveCards = [
  {
    title: "PCD Franchise",
    summary: "Exclusive monopoly rights structured for rapid market acquisition.",
    body: "Our PCD pharma franchise model offers comprehensive district or city territory rights designed to ensure controlled competition and sustainable partner profitability. We supply detailed operational playbooks, product catalogs, and live fulfillment support to guarantee high commercial velocity from day one.",
    icon: Users,
    image: "/hero/1.webp",
  },
  {
    title: "Manufacturing",
    summary: "WHO-GMP compliant facilities engineered for batch consistency.",
    body: "Every formulation is manufactured under strict quality checkpoints, automated temperature-controlled processing, and authenticated botanical sourcing pipelines. This rigorous industrial workflow guarantees flawless compliance documentation, long product shelf lives, and reliable batch-to-batch uniformity.",
    icon: ShieldCheck,
    image: "/hero/2.webp",
  },
  {
    title: "Partner Growth",
    summary: "End-to-end promotional ecosystem built for conversion optimization.",
    body: "We equip our network with medical literatures, physician samples, localized visual aid folders, and automated regional advertising support. This proactive enablement infrastructure lowers marketing barriers, strengthens early customer retention, and accelerates investment recovery across target markets.",
    icon: BadgeCheck,
    image: "/hero/3.webp",
  },
  {
    title: "Product Portfolio",
    summary: "Comprehensive healthcare options matching dynamic therapeutic needs.",
    body: "Our expansive Ayurvedic formula index spans general health tonics, customized herbal remedies, skin care solutions, and specialized metabolic capsules. Offering an extensive, certified portfolio allows partners to unlock immediate cross-selling traction and command high market discovery across multiple consumer demographics.",
    icon: BadgeCheck,
    image: "/hero/4.webp",
  },
  {
    title: "Pan India Network",
    summary: "Robust operational distribution networks reaching crucial regional centers.",
    body: "Backed by optimized transport logistics and centralized hubs, our supply framework delivers rapid order fulfillment across urban and rural sectors. This broad infrastructural footprint guarantees immediate stock turnaround times, minimizes business backlogs, and secures commercial stability for franchise offices.",
    icon: Users,
    image: "/hero/5.webp",
  },
  {
    title: "Marketing Support",
    summary: "Tailored advertising strategies crafted for local marketplace presence.",
    body: "We optimize regional marketing performance by supplying customized banners, seasonal product kits, and high-impact digital promotional graphics. This strategic asset allocation helps independent franchise teams build distinct, trusted authority signatures within competitive localized healthcare networks.",
    icon: Sparkles,
    image: "/hero/6.webp",
  },
];

// Custom Premium Easing Curve
const premiumEase = [0.22, 1, 0.36, 1] as const;

// --- COMPONENT 1: ROW 1 CARDS (WITH INLINE EXPANSION) ---
function EditorialAuthorityCard({ title, body, icon: Icon }: typeof featureCards[0]) {
  return (
    <Card className="bg-white/75 dark:bg-black/45 p-4 md:p-6 flex flex-col md:h-full group border border-[var(--border-soft)] hover:border-[color:var(--brand-accent)]/30 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--brand-primary)]/10 text-[color:var(--brand-accent)]">
            <Icon size={16} />
          </div>

          <h3 className="font-heading font-semibold text-base md:text-lg tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        </div>

        {/* Content Box */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {body}
        </p>
      </div>
    </Card>
  );
}

// --- MAIN COMPONENT ---
export default function Philosophy() {
  const [selectedCard, setSelectedCard] = useState<typeof interactiveCards[0] | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [row3Expanded, setRow3Expanded] = useState(false);

  const handleCardClick = (item: typeof interactiveCards[0]) => {
    setSelectedCard(item);
    setIsOverlayOpen(true);
  };

  // Scroll safety lock for modal windows
  useEffect(() => {
    document.body.style.overflow = isOverlayOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOverlayOpen]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-14 md:px-6 md:py-20 overflow-x-hidden">
      <div className="space-y-16 md:space-y-24">
        {/* HEADER */}
        <header className="text-center max-w-5xl mx-auto">
          <PageHeader
            title="Why Vedic Wellness Ayurvedic Franchise Partners Grow Faster"
            subtitle="Ancient Ayurvedic wisdom combined with modern pharmaceutical standards."
          />
        </header>

        {/* ── ROW 1: AUTHORITY CARDS ── */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {featureCards.map((card) => (
            <div key={card.id} className="group h-full">
              <EditorialAuthorityCard {...card} />
            </div>
          ))}
        </div>

        {/* ── ROW 2: INTERACTIVE FEATURED CARDS (HORIZONTAL SCROLL RAIL) ── */}
        <div className="w-full">
          <div className="carousel-scrollbar flex overflow-x-auto scroll-smooth pt-4 pb-6 gap-6 w-full">
            {interactiveCards.map((item, i) => (
              <div
                key={item.title}
                onClick={() => handleCardClick(item)}
                className="shrink-0 cursor-pointer w-[265px] sm:w-[290px] lg:w-[320px] group"
              >
                <Card className="!p-0 overflow-hidden bg-white dark:bg-[#0c0f0e] border-0 dark:border-0 shadow-md transition-shadow duration-300">
                  <div className="relative aspect-[3/4] w-full overflow-hidden p-3 bg-slate-50 dark:bg-zinc-900">
                    <div className="w-full h-full relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        loading={i < 4 ? "eager" : "lazy"}
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 290px, 265px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 z-10 space-y-1">
                      <div className="flex items-center gap-2 text-[color:var(--brand-primary)]">
                        <item.icon size={16} className="text-[color:var(--brand-accent)] brightness-125" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                          View Details
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wide">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-1 opacity-90">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 3: SEO / AUTHORITY CONTENT CARD ── */}
        <div className="group w-full">
          <Card className="bg-white/75 dark:bg-black/45 p-6 md:p-8 border border-[var(--border-soft)]">
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg md:text-xl text-slate-900 dark:text-slate-100">
                Strategic Market Development & Regional Scalability
              </h3>

              <div className="relative overflow-hidden">
                <m.div
                  animate={{ maxHeight: row3Expanded ? 500 : 72 }}
                  transition={{
                    duration: 0.35,
                    ease: premiumEase 
                  }}
                  className="overflow-hidden"
                >
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    Our cooperative operational frame is explicitly custom-tailored for regional enterprise acceleration. By combining centuries-old dynamic holistic therapies with strict automated Western manufacturing protocols, we supply verified business foundations. Partners gain priority access to complete digital supply catalogs, fast batching setups, and local consumer discovery pipelines.
                    <br /><br />
                    This structural optimization ensures minimal turnaround bottlenecks, protecting immediate operational margins while expanding geographical footprints. Dedicated account technicians actively manage distribution parameters across connected territories to ensure scalable compound development alongside long-term commercial compliance.
                  </p>
                </m.div>
              </div>

              <button
                onClick={() => setRow3Expanded(!row3Expanded)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[color:var(--brand-accent)] focus:outline-none hover:opacity-80 transition-opacity"
              >
                <span>{row3Expanded ? "Collapse Content" : "Read More Strategy"}</span>
                <ChevronDown size={14} className={`transform transition-transform duration-200 ${row3Expanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── BLURRED OVERLAY BOTTOM SHEET MODAL (SHARED REUSE) ── */}
      <AnimatePresence>
        {isOverlayOpen && selectedCard && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOverlayOpen(false)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 backdrop-blur-md p-4"
          >
            <m.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300, ease: premiumEase }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0a0f0d] border border-[var(--border-soft)] rounded-2xl shadow-2xl p-6 mb-2 overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  onClick={() => setIsOverlayOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/15 text-[color:var(--brand-accent)] dark:bg-[color:var(--brand-primary)]/25">
                  {(() => {
                    const ModalIcon = selectedCard.icon;
                    return <ModalIcon size={18} />;
                  })()}
                </div>
                <div className="space-y-2 pr-6">
                  <div>
                    <h4 className="font-heading text-base font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                      {selectedCard.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold text-[color:var(--brand-accent)] mt-0.5">
                      {selectedCard.summary}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {selectedCard.body}
                  </p>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}