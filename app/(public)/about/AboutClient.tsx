"use client";

import { useState, type ReactNode } from "react";
import {
  Leaf,
  HeartHandshake,
  MapPin,
  Truck,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { fadeUpSoft } from "@/app/animations";

import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import SeoLink from "@/components/public/ui/SeoLink";
import ExpandableSeoContent from "@/components/public/ui/ExpandableSeoContent";

/* ------------------------------------------------------------------ */
/* Data */
/* ------------------------------------------------------------------ */

type FAQ = { q: string; a: ReactNode };

const faqs: FAQ[] = [
  {
    q: "What is Vedic Wellness?",
    a: "Vedic Wellness is the Ayurvedic healthcare brand of Innovia Drugs, offering GMP-certified Ayurvedic, herbal and wellness products through a PCD pharma franchise model across India.",
  },
  {
    q: "What is a PCD Pharma Franchise?",
    a: (
      <>
        A PCD Pharma Franchise allows you to distribute and market a
        company&apos;s products in your assigned area with complete promotional and
        operational support. Browse our{" "}
        <SeoLink href="/products">Ayurvedic product range</SeoLink> to see the
        kind of formulations a franchise covers.
      </>
    ),
  },
  {
    q: "Do you provide monopoly rights?",
    a: "Yes. Monopoly rights are provided for selected areas based on availability, so each distributor gets an exclusive territory to build their business.",
  },
  {
    q: "What distributor and franchise support do you provide?",
    a: (
      <>
        Partners receive promotional support, visual aids, product cards, and
        marketing guidance along with reliable dispatch. For a specific
        question,{" "}
        <SeoLink href="/contact">contact the Vedic Wellness team</SeoLink>.
      </>
    ),
  },
  {
    q: "How do I become a franchise or distribution partner?",
    a: (
      <>
        Start by sharing your name, city or district and the territory you are
        interested in through our <SeoLink href="/contact">enquiry form</SeoLink>
        . You can also <SeoLink href="/signup">create an account</SeoLink> to
        view the product catalogue and manage enquiries.
      </>
    ),
  },
];

const journey: {
  step: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  image: string;
  alt: string;
}[] = [
  {
    step: "01",
    title: "Est. 2018",
    desc: "Vedic Wellness began as the Ayurvedic division of Innovia Drugs, rooted in Ambala, Haryana.",
    icon: MapPin,
    image: "/hero/1.webp",
    alt: "Vedic Wellness Ayurvedic products and company origins since 2018",
  },
  {
    step: "02",
    title: "GMP-Certified Manufacturing",
    desc: "The product portfolio is built on GMP-certified manufacturing and a growing range of Ayurvedic, herbal and wellness formulations.",
    icon: Leaf,
    image: "/hero/2.webp",
    alt: "GMP-certified Ayurvedic manufacturing facility",
  },
  {
    step: "03",
    title: "Distributor-First Franchise Model",
    desc: "Partners receive exclusive monopoly rights for their territory, supported by product training and promotional materials.",
    icon: HeartHandshake,
    image: "/hero/3.webp",
    alt: "Vedic Wellness distributor-first PCD franchise model",
  },
  {
    step: "04",
    title: "Pan-India Reach",
    desc: "Fast dispatch and marketing support help franchise and distribution partners serve customers across India.",
    icon: Truck,
    image: "/hero/4.webp",
    alt: "Vedic Wellness pan-India distribution and dispatch network",
  },
];

const storyMedia = (
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white/75 shadow-[0_20px_50px_rgba(2,101,54,0.25),0_8px_20px_rgba(0,0,0,0.12)] dark:bg-black/45">
    <Image
      src="/hero/1.gif"
      alt="Vedic Wellness Ayurvedic products and PCD pharma franchise"
      fill
      unoptimized
      sizes="(max-width: 768px) 100vw, 400px"
      className="object-cover"
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* Components */
/* ------------------------------------------------------------------ */

function CtaLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
}) {
  const styles =
    variant === "primary"
      ? "bg-[#039751] text-white shadow-sm hover:bg-[#027d44] hover:shadow-md dark:bg-[#84eb4b] dark:text-[#0a1a07] dark:hover:bg-[#76d441] dark:shadow-none"
      : "bg-white text-[#039751] border border-[#039751]/50 shadow-sm hover:bg-[#f0fdf4] hover:border-[#039751] dark:bg-[#1a1a1a] dark:text-white dark:border-white/10 dark:hover:bg-[#242424] dark:hover:border-white/20";

  return (
    <Link
      href={href}
      className={`relative inline-flex h-10 min-w-[100px] items-center justify-center rounded-md px-5 text-[13px] font-semibold tracking-wide uppercase whitespace-nowrap select-none transition-colors duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#84eb4b]/60 sm:min-w-[140px] ${styles}`}
    >
      {children}
    </Link>
  );
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border-b border-[var(--border-soft)] last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
      >
        <span className="font-heading text-base font-semibold text-[var(--text-main)]">
          {faq.q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[color:var(--brand-accent)] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--text-muted)] sm:px-6 sm:pr-12">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default function AboutClient() {
  return (
    <section>
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-6 sm:px-6 md:space-y-16 md:py-10">
        {/* Hero + top CTA */}
        <div className="space-y-6 md:space-y-8">
          <PageHeader
            className="max-w-3xl"
            title={
              <>
                A brand built on Ayurveda,{" "}
                <span className="text-[color:var(--brand-accent)]">
                  quality & trust
                </span>
              </>
            }
            subtitle="Vedic Wellness (A Division of Innovia Drugs) empowers PCD partners with high-demand Ayurvedic products, monopoly rights, fast dispatch, and strong marketing support."
          />

          <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
            <CtaLink href="/contact">Enquire About Franchise</CtaLink>
            <CtaLink href="/blogs" variant="secondary">
              Read Blogs
            </CtaLink>
          </div>
        </div>

        {/* Brand story */}
        <m.div variants={fadeUpSoft} initial="hidden" animate="show">
          <ExpandableSeoContent
            title="The Vedic Wellness Story"
            titleClassName="font-heading text-2xl font-semibold tracking-tight text-[var(--text-main)] sm:text-3xl"
            preview="Vedic Wellness is the Ayurvedic healthcare division of Innovia Drugs, offering GMP-certified Ayurvedic and herbal products through a PCD pharma franchise model."
            media={storyMedia}
          >
            <p>
              <SeoLink href="/">Vedic Wellness</SeoLink> is the Ayurvedic
              healthcare division of{" "}
              <a
                href="https://www.innoviadrugs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[color:var(--brand-accent)] hover:underline"
              >
                Innovia Drugs
              </a>
              , built on GMP-certified manufacturing and a portfolio of{" "}
              <SeoLink href="/products">
                Ayurvedic, herbal and wellness products
              </SeoLink>
              . The range spans everyday health needs — immunity, digestive
              care, liver tonics, personal care, women&apos;s wellness and daily
              health supplements.
            </p>
            <p>
              As an Ayurvedic PCD pharma franchise company, Vedic Wellness works
              through a partner-first model.{" "}
              <SeoLink href="/contact">
                Franchise and distribution partners
              </SeoLink>{" "}
              are offered exclusive monopoly rights for their territory, along
              with product training, visual aids, brochures and other marketing
              support.
            </p>
            <p>
              By blending traditional{" "}
              <SeoLink href="/blogs">Ayurvedic knowledge</SeoLink> with modern
              pharmaceutical standards, Vedic Wellness helps partners build
              sustainable distribution businesses across India — rooted in
              Ambala, Haryana and supported by fast, reliable dispatch
              nationwide.
            </p>
          </ExpandableSeoContent>
        </m.div>

        {/* Journey */}
        <div>
          <SectionHeading
            title="Our Journey"
            subtitle="How Vedic Wellness is building a franchise-first Ayurvedic brand"
          />

          <div className="carousel-scrollbar mt-8 flex gap-3 overflow-x-auto snap-x snap-proximity pb-1 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4 md:overflow-visible md:pb-0">
            {journey.map(({ step, title, desc, icon: Icon, image, alt }) => (
              <div
                key={title}
                className="group snap-start shrink-0 w-[250px] md:w-auto"
              >
                <Card className="h-full overflow-hidden !p-0 bg-white/75 dark:bg-black/45">
                  {/* Image band */}
                  <div className="relative aspect-[16/8] w-full overflow-hidden">
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      sizes="(max-width: 768px) 250px, 320px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Mobile: compact card */}
                  <div className="flex flex-col gap-1.5 p-4 md:hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-widest text-[color:var(--brand-accent)] opacity-60">
                        {step}
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)]">
                        <Icon size={15} />
                      </div>
                    </div>
                    <h3 className="font-heading text-sm font-semibold leading-snug text-[var(--text-main)]">
                      {title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                      {desc}
                    </p>
                  </div>

                  {/* Desktop: horizontal strip */}
                  <div className="hidden items-stretch md:flex">
                    <div className="flex min-w-[64px] flex-col items-center justify-between border-r border-[var(--border-soft)] bg-[color:var(--brand-primary)]/5 px-4 py-5 transition-colors duration-300 group-hover:bg-[color:var(--brand-primary)]/10">
                      <span className="text-[10px] font-black tracking-widest text-[color:var(--brand-accent)] opacity-60">
                        {step}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)] transition-colors duration-300 group-hover:bg-[color:var(--brand-primary)]/35">
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] opacity-0">{step}</span>
                    </div>

                    <div className="flex flex-col justify-center gap-1.5 px-5 py-5">
                      <h3 className="font-heading text-base font-semibold leading-snug text-[var(--text-main)]">
                        {title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                        {desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* SEO / company information (before FAQ) */}
        <div>
          <ExpandableSeoContent
            title="Ayurvedic PCD Pharma Franchise Opportunities"
            preview="Vedic Wellness, the Ayurvedic division of Innovia Drugs, combines GMP-certified Ayurvedic products with a distributor-first PCD pharma franchise model across India."
          >
            <p>
              Vedic Wellness is the Ayurvedic healthcare division of Innovia
              Drugs, offering GMP-certified Ayurvedic, herbal and wellness
              products. The portfolio spans everyday health categories —
              immunity, digestive care, liver tonics, personal care,
              women&apos;s wellness and daily health supplements — developed by
              blending traditional Ayurvedic knowledge with modern
              pharmaceutical standards.
            </p>
            <p>
              As an Ayurvedic PCD pharma franchise company, the business
              operates through a distributor-first approach. Partners can grow
              an Ayurvedic distribution business with exclusive monopoly rights
              for their territory, supported by product training, promotional
              materials such as visual aids and product cards, and fast,
              reliable dispatch across India.
            </p>
            <p>
              Explore the{" "}
              <SeoLink href="/products">Ayurvedic product range</SeoLink> to
              understand the categories and formulations on offer, or{" "}
              <SeoLink href="/blogs">
                learn more about our Ayurveda and franchise insights
              </SeoLink>{" "}
              through the knowledge center. When you are ready to take the next
              step,{" "}
              <SeoLink href="/contact">
                contact the Vedic Wellness team about franchise opportunities
              </SeoLink>{" "}
              — share your city or district and the territory you are
              interested in, and we will help you understand how to proceed.
            </p>
          </ExpandableSeoContent>
        </div>

        {/* FAQ (final major content section) */}
        <div>
          <SectionHeading
            title="Franchise FAQ"
            subtitle="Common questions about our PCD Pharma Franchise model"
          />

          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white/75 dark:bg-black/45">
            {faqs.map((f, i) => (
              <FAQItem key={f.q} faq={f} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}