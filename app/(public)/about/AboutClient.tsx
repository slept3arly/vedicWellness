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

import { fadeUpSoft, staggerFast } from "@/app/animations";

import GlassCard from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";
import PageHeader from "@/components/public/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import Button from "@/components/public/ui/Button";

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

function MiniCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex gap-4">
        <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
          <Icon size={22} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-3xl border border-slate-200 bg-white/70 shadow-md dark:border-slate-800 dark:bg-slate-900/60 overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex justify-between px-6 py-5 text-left"
      >
        <span className="font-bold text-slate-900 dark:text-white">
          {faq.q}
        </span>
        <span
          className={`text-xl transition-transform ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 pb-5 text-slate-700 dark:text-slate-300"
        >
          {faq.a}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function AboutClient() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-14">

        <PageHeader
          badge={
            <Chip className="flex items-center gap-2">
              <Sparkles size={14}/> About Vedic Wellness
            </Chip>
          }
          title={
            <>A brand built on Ayurveda, <span className="text-green-600">quality & trust</span></>
          }
          subtitle="Vedic Wellness (A Division of Innovia Drugs) supports PCD partners with high-demand Ayurvedic products, monopoly rights, fast dispatch and strong marketing support across India."
        />

        {/* Trust chips */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2"
        >
          {[
            "ISO Certified",
            "WHO-GMP Quality",
            "District Monopoly",
            "Fast Dispatch",
            "Promotional Support",
          ].map(t => (
            <motion.div key={t} variants={fadeUpSoft}>
              <Chip>{t}</Chip>
            </motion.div>
          ))}
        </motion.div>

        {/* Who / mission / vision */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {[
            ["Who We Are","We are a growing Ayurvedic healthcare brand focused on premium-quality products and franchise partner growth."],
            ["Our Mission","To deliver effective Ayurvedic solutions while empowering partners with monopoly rights, low MOQ and promotional support."],
            ["Our Vision","To become a trusted Ayurvedic franchise brand across India by blending tradition with innovation."]
          ].map(([t,d])=>(
            <GlassCard key={t} className="p-7 dark:bg-slate-900/60">
              <h3 className="text-xl font-bold">{t}</h3>
              <p className="mt-2 text-slate-700 dark:text-slate-300">{d}</p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-4 md:grid-cols-4"
        >
          <MiniCard icon={BadgeCheck} title="WHO-GMP Quality" desc="Strong quality standards" />
          <MiniCard icon={MapPin} title="Monopoly Rights" desc="Exclusive areas" />
          <MiniCard icon={Truck} title="Fast Dispatch" desc="Quick delivery system" />
          <MiniCard icon={ShieldCheck} title="Trusted Support" desc="Marketing assistance" />
        </motion.div>

        {/* Journey */}
        <div>
          <SectionHeading
            title="Our Journey"
            subtitle="How Vedic Wellness is building a franchise-first Ayurvedic brand"
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {[
              { title: "Product Focus", desc: "High demand Ayurvedic range", icon: Leaf },
              { title: "Partner Growth", desc: "Distributor-first franchise model", icon: HeartHandshake },
              { title: "PAN India Reach", desc: "Fast logistics & marketing", icon: Truck },
            ].map(i => (
              <GlassCard key={i.title} className="p-7 dark:bg-slate-900/60">
                <div className="flex gap-4">
                  <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                    <i.icon size={22}/>
                  </div>
                  <div>
                    <h3 className="font-bold">{i.title}</h3>
                    <p className="text-slate-700 dark:text-slate-300">{i.desc}</p>
                  </div>
                </div>
              </GlassCard>
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
            {faqs.map((f,i)=>(
              <FAQItem key={f.q} faq={f} index={i}/>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8 bg-green-500/10 border-green-600/25 dark:bg-slate-900/60">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold">
                  Want the product list & franchise offer?
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Receive the latest Ayurvedic catalog & schemes on WhatsApp.
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => window.open("https://wa.me/+919306025799","_blank")}>
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
