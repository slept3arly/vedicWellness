"use client";

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

export default function ProductHero({ product }: { product: Product }) {
  const allImages = [product.imageUrl, ...(product.gallery ?? [])].filter(
    Boolean
  ) as string[];

  const reviewCount = product.reviews?.length ?? 0;
  const avgRating =
    reviewCount > 0
      ? (product.reviews!.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1)
      : null;

  const inStock = product.stock > 0;

  return (
    <Card className="mt-4 md:mt-6 overflow-hidden p-0">
      <div className="flex flex-col lg:flex-row">

        {/* IMAGE */}
        <div className="relative w-full lg:w-1/2 h-[260px] sm:h-[320px] lg:h-[400px] bg-zinc-50 dark:bg-zinc-900/50">
          <ProductCarousel images={allImages} name={product.name} />
        </div>

        {/* CONTENT */}
        <div className="w-full lg:w-1/2 p-5 md:p-7 flex flex-col gap-4 justify-center">
          {/* META STRIP */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-heading uppercase tracking-widest text-[color:var(--text-muted)]">
            {product.tag && (
              <span className="text-[color:var(--brand-primary)] font-semibold">
                {product.tag}
              </span>
            )}

            {product.medicineForm && (
              <>
                <span className="opacity-40">·</span>
                <span>{product.medicineForm}</span>
              </>
            )}

            {avgRating && (
              <>
                <span className="opacity-40">·</span>
                <span className="flex items-center gap-0.5">
                  <Star size={9} className="fill-amber-400 text-amber-400" />
                  {avgRating}
                </span>
              </>
            )}

            <span className="opacity-40">·</span>

            {inStock ? (
              <span className="text-emerald-500 flex items-center gap-0.5">
                <CheckCircle2 size={9} />
                In Stock
              </span>
            ) : (
              <span className="text-red-500 flex items-center gap-0.5">
                <XCircle size={9} />
                Out of Stock
              </span>
            )}
          </div>

          {/* TITLE */}
          <div>
            <PageHeader
              title={product.name}
              subtitle={product.subtitle ?? undefined}
              align="left"
              className="!p-0 !max-w-none !space-y-1"
            />
          </div>

          {/* SHORT DESC */}
          {product.shortDescription && (
            <p className="text-sm text-[color:var(--text-muted)] leading-relaxed line-clamp-3">
              {product.shortDescription}
            </p>
          )}

          {/* QUICK HIGHLIGHTS (MAX 2) */}
          {product.highlights?.slice(0, 2).map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-sm"
            >
              <Target size={13} className="mt-0.5 text-[color:var(--brand-primary)]" />
              {h}
            </div>
          ))}

          {/* TRUST STRIP */}
          <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-[color:var(--text-muted)]">
            <span>✔ Ayurvedic</span>
            <span>✔ GMP Certified</span>
            <span>✔ Made in India</span>
          </div>

        </div>
      </div>
    </Card>
  );
}