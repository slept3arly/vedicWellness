"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

import Card from "@/components/public/ui/Card";
import { fadeUpSoft, staggerFast } from "@/app/animations";
import { ProductFAQ as FAQType } from "./types";

function FAQItem({ faq }: { faq: FAQType }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl">
      <Card className="bg-white/75 dark:bg-black/45 p-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-5 text-left"
        >
          <span className="flex items-center gap-2.5 font-semibold text-sm">
            <ChevronRight size={13} className="text-accent shrink-0" />
            {faq.question}
          </span>
          <span className={`text-xl transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
            +
          </span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="c"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 text-sm text-muted leading-relaxed">
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
      className="space-y-4"
    >
      <h2 className="font-heading text-xl font-black">Frequently Asked Questions</h2>
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