"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Star,
  Target,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";
import ProductCarousel from "./ProductCarousel";
import { Product } from "./types";
import { staggerFast, reveal } from "@/app/animations";

export default function ProductHero({ product }: { product: Product }) {
  const allImages = [product.imageUrl, ...(product.gallery ?? [])].filter(
    Boolean
  ) as string[];

  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
        )
      : null;

  const reviewCount = product.reviews?.length ?? 0;
  const avgRating =
    reviewCount > 0
      ? (product.reviews!.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1)
      : null;

  const inStock = product.stock > 0;

  return (
    <Card className="mt-4 md:mt-8 overflow-hidden p-0">
      <div className="flex flex-col lg:flex-row">

        {/* ── LEFT: Carousel — fixed landscape height ── */}
        <div className="relative w-full lg:w-1/2 h-[280px] sm:h-[360px] lg:h-[440px] bg-zinc-50 dark:bg-zinc-900/50">
          <ProductCarousel images={allImages} name={product.name} />

          {discountPct && (
            <span
              aria-label={`${discountPct}% discount`}
              className="
                absolute top-4 left-4 z-30
                bg-emerald-500 text-white
                text-[10px] font-heading font-bold uppercase tracking-widest
                px-2.5 py-1 rounded-full pointer-events-none
              "
            >
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* ── RIGHT: Product info only — no price card ── */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="show"
          className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col gap-5 justify-center"
        >
          {/* Eyebrow: category · form · rating · stock */}
          <motion.div
            variants={reveal}
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-heading uppercase tracking-widest text-[color:var(--text-muted)]"
          >
            {product.tag && (
              <span className="text-[color:var(--brand-primary)] font-semibold">
                {product.tag}
              </span>
            )}
            {product.medicineForm && (
              <>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span>{product.medicineForm}</span>
              </>
            )}
            {avgRating && (
              <>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span className="flex items-center gap-0.5">
                  <Star size={9} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                  {avgRating}
                  <span className="opacity-60 ml-0.5">({reviewCount})</span>
                </span>
              </>
            )}
            <span aria-hidden="true" className="opacity-40">·</span>
            {inStock ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <CheckCircle2 size={9} aria-hidden="true" />
                In Stock
              </span>
            ) : (
              <span className="text-red-500 flex items-center gap-0.5">
                <XCircle size={9} aria-hidden="true" />
                Out of Stock
              </span>
            )}
          </motion.div>

          {/* Title + subtitle */}
          <motion.div variants={reveal}>
            <PageHeader
              title={product.name}
              subtitle={product.subtitle ?? undefined}
              align="left"
              className="!p-0 !max-w-none !space-y-1"
            />
          </motion.div>

          {/* Short description */}
          {product.shortDescription && (
            <motion.p
              variants={reveal}
              className="font-body text-sm md:text-base text-[color:var(--text-muted)] leading-relaxed"
            >
              {product.shortDescription}
            </motion.p>
          )}

          {/* Top highlights — max 3, compact */}
          {product.highlights?.slice(0, 3).map((h, i) => (
            <motion.div
              key={i}
              variants={reveal}
              className="flex items-start gap-2 text-sm font-body text-[color:var(--text-main)]"
            >
              <Target
                size={13}
                className="shrink-0 mt-0.5 text-[color:var(--brand-primary)]"
                aria-hidden="true"
              />
              {h}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Card>
  );
}