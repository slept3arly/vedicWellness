"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Shield, Leaf, MapPin } from "lucide-react";
import MediaSlider, { type Slide } from "@/components/public/ui/MediaSlider";
import Button from "@/components/public/ui/Button";
import Image from "next/image";

const pillars = [
  { icon: Shield, label: "Monopoly PCD Model" },
  { icon: Leaf, label: "GMP Certified Manufacturing" },
];

const stats = [
  {
    value: "200+",
    label: "PCD Products",
    image: "/hero/card-products.jpg",
  },
  {
    value: "500+",
    label: "Active Partners",
    image: "/hero/card-partners.jpg",
  },
];

const features = [
  {
    title: "Exclusive Monopoly Rights",
    desc: "Own your territory — no other distributor in your district or city.",
  },
  {
    title: "Marketing & Dispatch Support",
    desc: "Promotional materials, visual aids, and fast logistics from day one.",
  },
];

const certBadges = ["ISO 9001:2018", "GMP Certified", "Ayush Approved"];

const heroSlides: Slide[] = [
  {
    id: "1",
    imageDesktopUrl: "/hero/1.gif",
    imageMobileUrl: "/hero/1.gif",
    mediaType: "gif",
  },
];

export default function Hero() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="min-h-screen flex flex-col font-body bg-transparent">
      <div className="flex-1 flex items-start pt-8 md:pt-12">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-10 md:pb-14">
          <div className="grid md:grid-cols-[1fr_480px] lg:grid-cols-[1fr_520px] gap-8 lg:gap-12 items-start">

            {/* LEFT */}
            <div className="space-y-5 flex flex-col items-center md:items-start text-center md:text-left">

              <div className="block md:hidden w-full">
                <MediaSlider
                  slides={heroSlides}
                  aspectClass="aspect-[4/3]"
                  interval={4000}
                />
              </div>

              {/* Heading — Cormorant Garamond serif with italic accent */}
              <h1
                className="font-bold leading-[1.05] tracking-tight text-[#0d1f14] dark:text-[#e8f5ee]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.6rem, 5vw, 4.6rem)",
                }}
              >
                Leading PCD Pharma Franchise<br />
                <em
                  className="text-[#039751] dark:text-[#84eb4b]"
                  style={{ fontStyle: "italic", fontWeight: 600 }}
                >
                  Vedic Wellness in India
                </em>
                <br />
                
                
              </h1>

              <div className="max-w-4xl">
                <p
                  className={`text-sm leading-relaxed text-justify text-[#3d5a47] dark:text-[#8db89e]
                    ${expanded ? "" : "line-clamp-4 md:line-clamp-7"}`}
                >
                  Vedic Wellnessis the trusted Ayurvedic division of Innovia Drugs. It is a leading
                  PCD Pharma Franchise Company in India offering high-quality Ayurvedic,
                  herbal, and wellness products supported by it&apos;s GMP-certified manufacturing
                  standards. We provide entrepreneurs, distributors, and professionals in pharma
                  with many profitable monopoly-based franchise opportunities supported by an
                  extensive portfolio of Ayurvedic medicines, immunity boosters, digestive
                  care products, liver tonics, personal care products, women&apos;s wellness formulations,
                  and daily health supplements. The buisness model we follow is
                  designed to help franchise partners grow exponentially faster through exclusive
                  territorial rights, attractive promotional support, visual aids, product
                  training, timely dispatch services, and dedicated business assistance.
                  With a strong commitment to quality, innovation, and customer satisfaction,
                  Vedic Wellness continues to expand its presence pan India while prviding help to
                  partners while they build sustainable pharmaceutical businesses in the rapidly growing
                  Ayurvedic healthcare sector. Whether you are looking to start a new pharma
                  venture or expand your existing distribution network, Vedic Wellness offers
                  one of the most reliable and growth-focused Ayurvedic PCD Pharma Franchise
                  opportunities in India with it&apos;s superior customer support and products.
                </p>

                {!expanded && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="inline ml-1 text-sm font-medium text-[#039751] dark:text-[#84eb4b]"
                  >
                    Read More
                  </button>
                )}

                {expanded && (
                  <button
                    onClick={() => setExpanded(false)}
                    className="inline ml-1 text-sm font-medium text-[#039751] dark:text-[#84eb4b]"
                  >
                    Read Less
                  </button>
                )}
              </div>

              {/* Pillar chips */}
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                {pillars.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(3,151,81,0.25)] bg-[rgba(3,151,81,0.05)] text-[0.72rem] font-medium text-[#024a29] dark:border-[rgba(132,235,75,0.2)] dark:bg-[rgba(132,235,75,0.04)] dark:text-lime-400"
                  >
                    <Icon size={11} />
                    {label}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1 w-full sm:w-auto items-center">
                <div className="w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => router.push("/contact")}
                  >
                    Apply for Franchise
                    <ArrowRight size={13} className="ml-1.5 inline-block" />
                  </Button>
                </div>

                <div className="w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-auto"
                    variant="secondary"
                    onClick={() => router.push("/products")}
                  >
                    View Products
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT CARD — uses surface (white in light, dark in dark mode) */}
            <div className="surface overflow-hidden hidden md:block">

              {/* Stats row */}
              <div className="grid grid-cols-2 divide-x divide-[var(--border-soft)]">
                {stats.map(({ value, label, image }) => (
                  <div key={label} className="text-center">

                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={image}
                        alt={label}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="px-2 py-4">
                      <div
                        className="font-bold leading-none text-[var(--brand-primary)] dark:text-[#84eb4b]"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "2rem",
                        }}
                      >
                        {value} 
                      </div>

                      <div className="text-[0.6rem] font-bold tracking-widest uppercase text-muted mt-0.5">
                        {label}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              <div className="h-px bg-[var(--border-soft)]" />

              {/* Section label */}
              <div className="px-4 pt-2.5 pb-1">
                <p className="text-[0.58rem] tracking-[0.18em] uppercase font-bold text-[var(--brand-primary)] dark:text-[#84eb4b] opacity-80">
                  Why Partners Choose Us
                </p>
              </div>

              {/* Feature list */}
              {features.map(({ title, desc }, i) => (
                <div
                  key={title}
                  className={`flex gap-2.5 items-start px-4 py-2.5 ${i < features.length - 1 ? "border-b border-[var(--border-soft)]" : ""}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] dark:bg-[#84eb4b] shrink-0 mt-1" />
                  <div>
                    <div className="text-[0.78rem] font-semibold text-[var(--text-main)] leading-snug">{title}</div>
                    <div className="text-[0.7rem] text-muted leading-relaxed mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 border-t border-[var(--border-soft)] bg-[var(--bg-surface)]">
                <span className="flex items-center gap-1 text-[0.65rem] text-muted">
                  <MapPin size={9} />
                  Est. 2018 · Ambala, Haryana
                </span>
                <div className="flex gap-1 flex-wrap">
                  {certBadges.map((b) => (
                    <span
                      key={b}
                      className="text-[0.58rem] font-bold tracking-wide uppercase text-[var(--brand-primary)] dark:text-[#84eb4b] px-1.5 py-0.5 border border-[rgba(2,101,54,0.25)] dark:border-[rgba(132,235,75,0.2)] rounded"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Ornament strip */}
      <div className="w-full px-6 md:px-10 pb-6">
        <div className="flex items-center gap-3 w-full before:flex-1 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[rgba(3,151,81,0.2)] before:to-transparent after:flex-1 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[rgba(3,151,81,0.2)] after:to-transparent">
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-muted font-medium whitespace-nowrap">
            Trusted · GMP Certified · ISO Approved
          </span>
        </div>
      </div>

    </section>
  );
}
