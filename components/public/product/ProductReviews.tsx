"use client";

import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";

import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import ProductStars from "./ProductStars";
import { fadeUpSoft, staggerFast } from "@/app/animations";
import { calcAvg, ProductReview } from "./types";

export default function ProductReviews({ reviews }: { reviews: ProductReview[] }) {
  if (!reviews.length) return null;

  const avg = calcAvg(reviews);

  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[color:var(--border-soft)]">
        <div className="flex items-center gap-2">
          <MessageSquareQuote size={18} className="text-[color:var(--brand-primary)]" aria-hidden="true" />
          <SectionHeading title="Customer Reviews" align="left" />
        </div>

        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 rounded-xl self-start sm:self-auto">
          <div className="flex flex-col items-center border-r border-[color:var(--border-soft)] pr-4">
            <span className="font-heading text-2xl font-black text-[color:var(--text-main)] tabular-nums">
              {avg.toFixed(1)}
            </span>
            <span className="text-[10px] font-heading uppercase tracking-widest text-[color:var(--text-muted)]">
              Average
            </span>
          </div>
          <div className="space-y-1">
            <ProductStars rating={avg} size={14} />
            <p className="text-xs font-body text-[color:var(--text-muted)]">
              {reviews.length} verified {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.slice(0, 6).map((r) => (
          <motion.div key={r.id} variants={fadeUpSoft}>
            <Card className="h-full p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <ProductStars rating={r.rating} size={13} />
                <time
                  dateTime={new Date(r.createdAt).toISOString()}
                  className="font-heading text-[10px] uppercase tracking-widest text-[color:var(--text-muted)]"
                >
                  {new Date(r.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>

              {r.title && (
                <h4 className="font-heading font-semibold text-sm text-[color:var(--text-main)]">
                  {r.title}
                </h4>
              )}

              {r.comment && (
                <p className="text-sm font-body text-[color:var(--text-muted)] leading-relaxed italic flex-1">
                  "{r.comment}"
                </p>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-[color:var(--border-soft)] mt-auto">
                <div className="h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                    {String(r.id).charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-[11px] font-heading uppercase tracking-tight text-[color:var(--text-muted)]">
                  Verified Purchase
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}