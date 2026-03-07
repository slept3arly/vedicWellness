"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, HelpCircle } from "lucide-react";

import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { fadeUpSoft, staggerFast } from "@/app/animations";
import { ProductFAQ as FAQType } from "./types";

function FAQItem({ faq }: { faq: FAQType }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl">
      <Card className="bg-white/75 dark:bg-black/45 p-0 transition-all duration-300">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-5 text-left group"
        >
          <span className="flex items-center gap-2.5 font-heading font-semibold text-sm md:text-base">
            <ChevronRight 
              size={14} 
              className={`text-[color:var(--brand-accent)] transition-transform duration-300 ${open ? "rotate-90" : ""}`} 
            />
            {faq.question}
          </span>
          <span className={`text-2xl font-light transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
            +
          </span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 text-sm md:text-base text-muted-foreground leading-relaxed border-t border-foreground/5 pt-4">
                {faq.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
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
      className="space-y-8 mt-16"
    >
      <div className="flex items-center gap-3">
        <HelpCircle size={26} className="text-foreground" />
        <SectionHeading title="Frequently Asked Questions" />
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq) => (
          <motion.div key={faq.id} variants={fadeUpSoft}>
            <FAQItem faq={faq} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}