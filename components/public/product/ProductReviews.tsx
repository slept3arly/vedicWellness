"use client";

import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";

import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { fadeUpSoft, staggerSlow } from "@/app/animations";
import { calcAvg, ProductReview } from "./types";
import ProductStars from "./ProductStars";

export default function ProductReviews({ reviews }: { reviews: ProductReview[] }) {
  if (!reviews.length) return null;

  const avg = calcAvg(reviews);

  return (
    <motion.div
      variants={staggerSlow}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-8 mt-16"
    >
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/5 pb-6">
        <div className="flex items-center gap-3">
          <MessageSquareQuote size={26} className="text-foreground" />
          <SectionHeading title="Customer Reviews" />
        </div>
        
        <div className="flex items-center gap-4 bg-foreground/5 px-5 py-3 rounded-2xl">
          <div className="flex flex-col items-center border-r border-foreground/10 pr-4">
            <span className="font-heading text-3xl font-black text-foreground">
              {avg.toFixed(1)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
              Average
            </span>
          </div>
          <div className="space-y-1">
            <ProductStars rating={avg} size={16} />
            <p className="text-xs font-medium text-muted-foreground">
              Based on {reviews.length} verified reviews
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.slice(0, 6).map((r) => (
          <motion.div key={r.id} variants={fadeUpSoft}>
            <Card className="bg-white/75 dark:bg-black/45 h-full p-6 flex flex-col justify-between group hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <ProductStars rating={r.rating} />
                  <span className="font-accent text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                
                {r.title && (
                  <h4 className="font-heading font-bold text-base text-foreground group-hover:text-[color:var(--brand-accent)] transition-colors">
                    {r.title}
                  </h4>
                )}
                
                {r.comment && (
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
                    “{r.comment}”
                  </p>
                )}
              </div>
              
              {/* Optional: Verified Buyer Badge */}
              <div className="mt-4 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-[color:var(--brand-primary)]/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[color:var(--brand-accent)]">
                    {r.id.toString().slice(0, 1).toUpperCase()}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-foreground/60 uppercase tracking-tighter">
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