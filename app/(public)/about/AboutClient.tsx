"use client";

import { m, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  BadgeCheck,
  Leaf,
  HeartHandshake,
  MapPin,
  Truck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { useRouter } from "next/navigation";

import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import Button from "@/components/public/ui/Button";

/* ------------------------------------------------------------------ */
/* Data */
/* ------------------------------------------------------------------ */

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  {
    q: "What is a PCD Pharma Franchise?",
    a: "A PCD Pharma Franchise allows you to distribute and market a company’s products in your assigned area with complete promotional and operational support.",
  },
  {
    q: "Do you provide monopoly rights?",
    a: "Yes. Monopoly rights are provided for selected areas based on availability to ensure strong business potential.",
  },
  {
    q: "What is the minimum order requirement?",
    a: "Minimum order depends on the selected product range. We keep it distributor-friendly for a low-risk start.",
  },
  {
    q: "What is the dispatch / delivery time?",
    a: "Orders are dispatched quickly after confirmation with safe packaging and reliable logistics.",
  },
  {
    q: "Is promotional support included?",
    a: "Yes. We provide visual aids, product cards, brochures, and marketing guidance.",
  },
];

/* ------------------------------------------------------------------ */
/* Components */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="group">
      <Card className="h-full bg-white/75 dark:bg-black/45">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-accent">
            <Icon size={22} />
          </div>
          <div>
            <h3 className="font-heading">{title}</h3>
            <p className="text-sm text-muted">{desc}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="group overflow-hidden rounded-3xl">
      <Card className="bg-white/75 dark:bg-black/45 p-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-5 text-left"
        >
          <span className="font-semibold">{faq.q}</span>

          <span
            className={`text-xl transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <m.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 text-sm text-muted">{faq.a}</div>
            </m.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default function AboutClient() {
  const router = useRouter();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-4 md:py-16 space-y-16">
        {/* Header */}
        <PageHeader
          badge={
            <Chip className="flex items-center gap-2">
              <Sparkles size={14} />
              About Vedic Wellness
            </Chip>
          }
          title={
            <>
              A brand built on Ayurveda,{" "}
              <span className="text-brand-accent">
                quality & trust
              </span>
            </>
          }
          subtitle="Vedic Wellness (A Division of Innovia Drugs) empowers PCD partners with high-demand Ayurvedic products, monopoly rights, fast dispatch, and strong marketing support."
        />

        {/* Trust chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "ISO Certified",
            "GMP Quality",
            "District Monopoly",
            "Fast Dispatch",
            "Promotional Support",
          ].map((t) => (
            <div key={t}>
              <Chip>{t}</Chip>
            </div>
          ))}
        </div>

        {/* Who / Mission / Vision */}
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            [
              "Who We Are",
              "A growing Ayurvedic healthcare brand focused on premium-quality products and partner success.",
            ],
            [
              "Our Mission",
              "Deliver effective Ayurvedic solutions while empowering franchise partners with a low-risk model.",
            ],
            [
              "Our Vision",
              "Become a trusted Ayurvedic franchise brand across India by blending tradition with innovation.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="group">
              <Card className="h-full bg-white/75 dark:bg-black/45">
                <h3 className="text-xl font-heading">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </Card>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            icon={BadgeCheck}
            title="GMP Quality"
            desc="Certified manufacturing standards"
          />
          <StatCard
            icon={MapPin}
            title="Monopoly Rights"
            desc="Exclusive territory allocation"
          />
          <StatCard
            icon={Truck}
            title="Fast Dispatch"
            desc="Reliable logistics network"
          />
          <StatCard
            icon={ShieldCheck}
            title="Trusted Support"
            desc="Marketing & partner assistance"
          />
        </div>

        {/* Journey */}
        <div>
          <SectionHeading
            title="Our Journey"
            subtitle="How Vedic Wellness is building a franchise-first Ayurvedic brand"
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Product Focus",
                desc: "High-demand Ayurvedic range",
                icon: Leaf,
              },
              {
                title: "Partner Growth",
                desc: "Distributor-first franchise model",
                icon: HeartHandshake,
              },
              {
                title: "PAN India Reach",
                desc: "Fast logistics & marketing",
                icon: Truck,
              },
            ].map((i) => (
              <div key={i.title} className="group">
                <Card className="h-full bg-white/75 dark:bg-black/45">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-accent">
                      <i.icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-heading">{i.title}</h3>
                      <p className="text-sm text-muted">{i.desc}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <SectionHeading
            title="Franchise FAQ"
            subtitle="Common questions about our PCD Pharma Franchise model"
          />

          <div className="mt-6 grid gap-4">
            {faqs.map((f, i) => (
              <FAQItem key={f.q} faq={f} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="group">
          <Card className="bg-white/75 dark:bg-black/45">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-2xl font-heading">
                  Start your Ayurvedic Franchise Journey
                </h3>

                <p className="mt-2 text-sm text-muted">
                  Join Vedic Wellness and grow with a trusted Ayurvedic brand. We
                  provide monopoly rights, promotional support, and fast dispatch
                  to help you scale confidently.
                </p>
              </div>

              <div className="flex md:justify-end flex-col">
                <Button
                  variant="secondary"
                  onClick={() =>
                    window.open("https://wa.me/+919306025799", "_blank")
                  }
                >
                  Get Product List on WhatsApp
                </Button>

                <Button
                  className="my-4"
                  onClick={() => router.push("/signup")}
                >
                  SignUp to View Products
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}