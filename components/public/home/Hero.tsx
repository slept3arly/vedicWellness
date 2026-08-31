"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Shield, Leaf } from "lucide-react";
import MediaSlider, { type Slide } from "@/components/public/ui/MediaSlider";
import Button from "@/components/public/ui/Button";
import Image from "next/image";

const pillars = [
  { icon: Shield, label: "Monopoly PCD Model", mobileLabel: "Monopoly PCD" },
  { icon: Leaf, label: "GMP Certified Manufacturing", mobileLabel: "GMP Certified" },
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
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="min-w-0 space-y-5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="block md:hidden w-full">
                <MediaSlider
                  slides={heroSlides}
                  aspectClass="aspect-[4/3]"
                  interval={4000}
                />
              </div>

              <h1
                className="font-bold leading-[1.05] tracking-tight text-[#0d1f14] dark:text-[#e8f5ee]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.6rem, 5vw, 4.6rem)",
                }}
              >
                Leading PCD Pharma Franchise <br className="md:hidden" />
                <em
                  className="text-[#039751] dark:text-[#84eb4b]"
                  style={{ fontStyle: "italic", fontWeight: 600 }}
                >
                  Vedic Wellness in India
                </em>
                <br className="md:hidden" />
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

              <div className="flex w-full flex-nowrap justify-center gap-1.5 md:w-auto md:flex-wrap md:justify-start">
                {pillars.map(({ icon: Icon, label, mobileLabel }) => (
                  <span
                    key={label}
                    className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[rgba(3,151,81,0.25)] bg-[rgba(3,151,81,0.05)] px-2 py-1 text-[0.65rem] font-medium text-[#024a29] dark:border-[rgba(132,235,75,0.2)] dark:bg-[rgba(132,235,75,0.04)] dark:text-lime-400 md:gap-1.5 md:px-3 md:text-[0.72rem]"
                  >
                    <Icon size={11} />
                    <span className="md:hidden">{mobileLabel}</span>
                    <span className="hidden md:inline">{label}</span>
                  </span>
                ))}
              </div>

              <div className="hidden md:flex flex-wrap gap-1.5">
                {certBadges.map((badge) => (
                  <span
                    key={badge}
                    className="text-[0.58rem] font-bold tracking-wide uppercase text-[var(--brand-primary)] dark:text-[#84eb4b] px-1.5 py-0.5 border border-[rgba(2,101,54,0.25)] dark:border-[rgba(132,235,75,0.2)] rounded"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex w-full flex-row items-center gap-2 pt-1 sm:w-auto sm:gap-3">
                <div className="min-w-0 flex-1 sm:w-auto sm:flex-none">
                  <Button
                    className="w-full px-3 text-[11px] sm:w-auto sm:px-5 sm:text-[13px]"
                    onClick={() => router.push("/contact")}
                  >
                    <span className="sm:hidden">Apply Now</span>
                    <span className="hidden sm:inline">Apply for Franchise</span>
                    <ArrowRight size={13} className="ml-1.5 inline-block" />
                  </Button>
                </div>

                <div className="min-w-0 flex-1 sm:w-auto sm:flex-none">
                  <Button
                    className="w-full px-3 text-[11px] sm:w-auto sm:px-5 sm:text-[13px]"
                    variant="secondary"
                    onClick={() => router.push("/products")}
                  >
                    <span className="sm:hidden">Products</span>
                    <span className="hidden sm:inline">View Products</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative hidden min-h-[460px] w-full md:block lg:min-h-[540px]">
              <div className="absolute right-0 top-0 z-0 aspect-[4/3] w-[84%] overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-surface shadow-[var(--shadow-soft)]">
                <Image
                  src="/hero/1.webp"
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1279px) 40vw, 500px"
                  className="object-cover"
                />
              </div>

              <div className="absolute left-[5%] top-[18%] z-10 aspect-[4/3] w-[76%] overflow-hidden rounded-[24px] border-[8px] border-white bg-white shadow-xl dark:border-[#121614] dark:bg-[#121614]">
                <Image
                  src="/hero/2.webp"
                  alt=""
                  fill
                  sizes="(max-width: 1279px) 36vw, 450px"
                  className="object-cover"
                />
              </div>

              <div className="absolute bottom-0 right-[2%] z-20 aspect-[4/3] w-[72%] overflow-hidden rounded-[24px] border-[10px] border-white bg-white shadow-2xl dark:border-[#121614] dark:bg-[#121614]">
                <Image
                  src="/hero/3.webp"
                  alt="Vedic Wellness Ayurvedic wellness products"
                  fill
                  priority
                  sizes="(max-width: 1279px) 34vw, 430px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
