"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { fadeUpSoft, staggerFast } from "@/app/animations";
import { ProductFAQ as FAQType } from "./types";

function FAQItem({ faq }: { faq: FAQType }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="
          flex w-full items-center justify-between
          px-5 py-4 text-left
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-inset focus-visible:ring-emerald-500
        "
      >
        <span className="font-heading font-semibold text-sm md:text-base text-[color:var(--text-main)] pr-4 leading-snug">
          {faq.question}
        </span>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`
            shrink-0 text-[color:var(--text-muted)] transition-transform duration-300
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-[color:var(--border-soft)] text-sm font-body text-[color:var(--text-muted)] leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function ProductFAQ({ faqs }: { faqs: FAQType[] }) {
  if (!faqs.length) return null;

  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <HelpCircle size={18} className="text-[color:var(--brand-primary)]" aria-hidden="true" />
        <SectionHeading title="Frequently Asked Questions" align="left" />
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <motion.div key={faq.id} variants={fadeUpSoft}>
            <FAQItem faq={faq} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}