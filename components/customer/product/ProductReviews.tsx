"use client";

import { motion } from "framer-motion";

import Card from "@/components/public/ui/Card";
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
      className="space-y-5"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-heading text-xl font-black">Customer Reviews</h2>
        <div className="flex items-center gap-3">
          <ProductStars rating={avg} size={16} />
          <span className="font-bold">{avg.toFixed(1)}</span>
          <span className="text-muted text-sm">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.slice(0, 6).map((r) => (
          <motion.div key={r.id} variants={fadeUpSoft}>
            <Card className="bg-white/75 dark:bg-black/45 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <ProductStars rating={r.rating} />
                <span className="text-[11px] text-muted">
                  {new Date(r.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {r.title   && <p className="font-bold text-sm">{r.title}</p>}
              {r.comment && <p className="text-sm text-muted leading-relaxed">{r.comment}</p>}
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}