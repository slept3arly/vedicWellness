"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  BadgeCheck,
  Leaf,
  HeartHandshake,
  MapPin,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { fadeUp } from "@/app/animations";

// ✅ UI Components
import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  {
    q: "What is a PCD Pharma Franchise?",
    a: "A PCD Pharma Franchise allows you to distribute and market a company’s products in your assigned area with support such as product range, marketing tools, and guidance.",
  },
  {
    q: "Do you provide monopoly rights?",
    a: "Yes. Monopoly rights are provided for selected areas depending on availability, ensuring better business potential.",
  },
  {
    q: "What is the minimum order requirement?",
    a: "Minimum order depends on your selected product range. We keep it distributor-friendly so partners can start with low investment.",
  },
  {
    q: "What is the dispatch / delivery time?",
    a: "Orders are dispatched quickly after confirmation. Delivery time depends on your location, but we aim for fast processing and safe packaging.",
  },
  {
    q: "Is promotional support included?",
    a: "Yes. We provide promotional support such as visual aids, brochures, product cards and more depending on requirements.",
  },
];

function MiniCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
          <Icon size={22} />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="font-body text-sm text-slate-600 dark:text-slate-300">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      layout="position"   // ✅ IMPORTANT: only position, no size morph
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="
        rounded-3xl overflow-hidden
        border border-slate-200
        bg-white/70
        shadow-lg
         -sm
        dark:border-slate-800
        dark:bg-slate-900/40
        will-change-transform
      "
    >
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-heading font-bold text-base md:text-lg text-slate-900 dark:text-white">
          {faq.q}
        </span>

        <span
          className={[
            "text-2xl font-bold text-slate-700 dark:text-slate-300 transition-transform duration-200",
            open ? "rotate-45" : "rotate-0",
          ].join(" ")}
        >
          +
        </span>
      </button>

      {/* Content */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="px-6 pb-5 font-body text-slate-700 dark:text-slate-300 leading-relaxed"
        >
          {faq.a}
        </motion.div>
      )}
    </motion.div>
  );
}



export default function AboutClient() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        {/* PAGE HEADER */}
        <PageHeader
          badge={
            <p className="inline-flex mx-auto items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              About Vedic Wellness
            </p>
          }
          title={
            <>
              A brand built on Ayurveda,{" "}
              <span className="text-w dark:text-green-400">quality & trust</span>.
            </>
          }
          subtitle="Vedic Wellness (A Division of Innovia Drugs) supports PCD partners with high-demand Ayurvedic products, monopoly rights, fast dispatch and strong marketing support across India."
        />

        {/* TRUST CHIPS */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {[
            "ISO Certified",
            "WHO-GMP Quality",
            "District Monopoly",
            "Fast Dispatch",
            "Promotional Support",
          ].map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </motion.div>

        {/* WHO / MISSION / VISION */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          <GlassCard className="p-7">
            <h3 className="font-heading text-xl font-extrabold text-slate-900 dark:text-white">
              Who We Are
            </h3>
            <p className="mt-2 font-body text-slate-700 dark:text-slate-300 leading-relaxed">
              We are a growing Ayurvedic healthcare brand focused on premium-quality
              products and franchise partner growth.
            </p>
          </GlassCard>

          <GlassCard className="p-7">
            <h3 className="font-heading text-xl font-extrabold text-slate-900 dark:text-white">
              Our Mission
            </h3>
            <p className="mt-2 font-body text-slate-700 dark:text-slate-300 leading-relaxed">
              To deliver effective Ayurvedic solutions while empowering partners
              with monopoly rights, low MOQ and complete promotional support.
            </p>
          </GlassCard>

          <GlassCard className="p-7">
            <h3 className="font-heading text-xl font-extrabold text-slate-900 dark:text-white">
              Our Vision
            </h3>
            <p className="mt-2 font-body text-slate-700 dark:text-slate-300 leading-relaxed">
              To become a trusted Ayurvedic franchise brand across India by blending
              tradition with innovation.
            </p>
          </GlassCard>
        </motion.div>

        {/* STATS STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-10 grid gap-4 md:grid-cols-4"
        >
          <MiniCard icon={BadgeCheck} title="WHO-GMP Quality" desc="Strong quality standards" />
          <MiniCard icon={MapPin} title="Monopoly Rights" desc="Exclusive district/city options" />
          <MiniCard icon={Truck} title="Fast Dispatch" desc="Quick processing & delivery" />
          <MiniCard icon={ShieldCheck} title="Trusted Support" desc="Marketing & distributor help" />
        </motion.div>

        {/* JOURNEY */}
        <div className="mt-14">
          <SectionHeading
            title="Our Journey"
            subtitle="How Vedic Wellness is building a franchise-first Ayurvedic brand"
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Step 1 — Product Focus",
                desc: "An Ayurvedic range designed for high demand and repeat customers.",
                icon: Leaf,
              },
              {
                title: "Step 2 — Partner Growth",
                desc: "A franchise model structured to help distributors scale confidently.",
                icon: HeartHandshake,
              },
              {
                title: "Step 3 — PAN India Reach",
                desc: "Fast dispatch systems + marketing support for consistent growth.",
                icon: Truck,
              },
            ].map((item) => (
              <GlassCard key={item.title} className="p-7">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-extrabold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-body text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <SectionHeading
            title="Franchise FAQ"
            subtitle="Common questions about our PCD Pharma Franchise model"
          />

          <div className="mt-6 grid gap-4">
            {faqs.map((faq, i) => (
              <FAQItem faq={faq} index={i} key={faq.q} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="mt-14"
        >
          <GlassCard className="p-6 md:p-8 border-green-600/25 bg-green-500/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
                  Want the product list & franchise offer?
                </h3>
                <p className="mt-2 font-body text-slate-700 dark:text-slate-300">
                  Receive the latest Ayurvedic catalog & partner schemes on WhatsApp.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => window.open("https://wa.me/+919306025799", "_blank")}
                >
                  WhatsApp Now
                </Button>

                <Button variant="secondary">Download Brochure</Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
