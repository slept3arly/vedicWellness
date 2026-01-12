"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Section from "@/components/Section";
import ThemeToggle from "@/components/ThemeToggle";

type FAQ = { q: string; a: string };
type Cert = { title: string; desc: string; icon: string };

const faqs: FAQ[] = [
  {
    q: "What is a PCD Pharma Franchise?",
    a: "A PCD Pharma Franchise allows you to distribute and market a company’s products in your assigned area with support such as product range, marketing tools, and guidance."
  },
  {
    q: "Do you provide monopoly rights?",
    a: "Yes. Monopoly rights are provided for selected areas depending on availability, ensuring better business potential."
  },
  {
    q: "What is the minimum order requirement?",
    a: "Minimum order depends on your selected product range. We keep it distributor-friendly so partners can start with low investment."
  },
  {
    q: "What is the dispatch / delivery time?",
    a: "Orders are dispatched quickly after confirmation. Delivery time depends on your location, but we aim for fast processing and safe packaging."
  },
  {
    q: "Is promotional support included?",
    a: "Yes. We provide promotional support such as visual aids, brochures, product cards and more depending on requirements."
  }
];

const certifications: Cert[] = [
  { title: "GMP Certified", desc: "Quality Manufacturing", icon: "✅" },
  { title: "ISO Standards", desc: "Process Assurance", icon: "🏅" },
  { title: "Ayurvedic Range", desc: "Herbal Formulations", icon: "🌿" },
  { title: "PAN India Supply", desc: "Fast Dispatch", icon: "🚚" }
];

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="
        relative w-full rounded-2xl overflow-hidden
        border bg-white/70 border-black/10
        dark:bg-white/5 dark:border-white/10
        backdrop-blur-md
      "
    >
      {/* highlight line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold text-lg text-black dark:text-white">
          {faq.q}
        </span>

        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold text-black/60 dark:text-white/70"
        >
          +
        </motion.span>
      </button>

      {/* ✅ original smooth animation */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="px-5"
      >
        <div className="pb-4 text-black/70 dark:text-white/70 leading-relaxed">
          {faq.a}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="flex flex-col items-center gap-8 py-28 px-4">
        {/* Hero */}
        <div className="w-full max-w-5xl flex flex-col gap-3 items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-4xl md:text-5xl font-noto font-bold text-black dark:text-white"
          >
            About Vedic Wellness
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="max-w-2xl leading-relaxed text-black/70 dark:text-white/70"
          >
            Vedic Wellness is a PCD Pharma Franchise company providing premium Ayurvedic
            product range, monopoly rights (area based), and strong promotional support for
            distributors across India.
          </motion.p>
        </div>

        {/* Certification Row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount:0.2 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {certifications.map((c) => (
            <motion.div
              key={c.title}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="
                relative rounded-2xl p-4
                border backdrop-blur-md
                bg-white/70 border-black/10
                dark:bg-white/5 dark:border-white/10
                overflow-hidden
              "
            >
              {/* highlight line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

              <div className="flex items-start gap-3">
                <div className="text-2xl">{c.icon}</div>
                <div>
                  <div className="font-bold text-black dark:text-white">
                    {c.title}
                  </div>
                  <div className="text-sm text-black/60 dark:text-white/60">
                    {c.desc}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* About Sections */}
        <div className="w-full max-w-5xl flex flex-col gap-6">
          <Section
            title="Who We Are"
            text="We are a growing Ayurvedic healthcare brand committed to delivering premium-quality products and helping distributors build successful businesses through the PCD Pharma Franchise model."
          />
          <Section
            title="Our Mission"
            text="To provide safe, effective Ayurvedic healthcare solutions while empowering franchise partners with monopoly rights, quality products, and dedicated support."
          />
          <Section
            title="Why Choose Vedic Wellness?"
            text="Wide product range • Monopoly rights • Distributor-friendly MOQ • Premium packaging • Fast dispatch • Marketing & promotional support"
          />
        </div>

        {/* FAQ */}
        <div className="w-full max-w-5xl mt-6 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount:0.2 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-black dark:text-white">
              Franchise FAQ
            </h2>
            <p className="mt-2 text-black/60 dark:text-white/60">
              Common questions about our PCD Pharma Franchise model
            </p>
          </motion.div>

          <div className="flex flex-col gap-4 mt-4">
            {faqs.map((faq, i) => (
              <FAQItem faq={faq} index={i} key={faq.q} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount:0.2 }}
          transition={{ duration: 0.35 }}
          className="
            w-full max-w-5xl mt-10 rounded-2xl p-6 md:p-8
            border bg-green-500/10 border-green-500/30
            backdrop-blur-md
          "
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-black dark:text-white">
                Interested in Franchise Partnership?
              </h3>
              <p className="mt-2 text-black/70 dark:text-white/70">
                Get our product list and franchise brochure on WhatsApp.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
                WhatsApp Now
              </button>

              <button
                className="px-5 py-2 rounded-xl border
                  border-black/10 bg-black/5 hover:bg-black/10 transition
                  dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15
                  text-black dark:text-white"
              >
                Download Brochure
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
