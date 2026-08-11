"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, PackageSearch } from "lucide-react";

import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { RelatedProduct, fmt } from "./types";

export default function ProductRelated({
  relatedProducts,
}: {
  relatedProducts: RelatedProduct[];
}) {
  if (!relatedProducts.length) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between pb-4 border-b border-[color:var(--border-soft)]">
        <div className="flex items-center gap-2">
          <PackageSearch size={18} className="text-[color:var(--brand-primary)]" aria-hidden="true" />
          <SectionHeading title="Related Products" align="left" />
        </div>
        <Link
          href="/products"
          prefetch={false}
          className="flex items-center gap-1 font-heading text-xs uppercase tracking-widest text-[color:var(--brand-primary)] hover:gap-2 transition-all"
        >
          View All <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {relatedProducts.map((rp) => (
          <div key={rp.id}>
            <Link href={`/products/${rp.slug}`} prefetch={false} className="group block h-full">
              <Card className="h-full p-0 flex flex-col">
                {rp.imageUrl && (
                  <div className="relative w-full h-36 overflow-hidden rounded-t-[calc(var(--radius)-1px)] bg-zinc-50 dark:bg-zinc-900">
                    <Image
                      src={rp.imageUrl}
                      alt={rp.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-4 gap-2">
                  <h3 className="font-heading text-sm font-semibold line-clamp-2 text-[color:var(--text-main)] group-hover:text-[color:var(--brand-primary)] transition-colors leading-tight">
                    {rp.name}
                  </h3>
                  {rp.shortDescription && (
                    <p className="text-xs font-body text-[color:var(--text-muted)] line-clamp-2 leading-relaxed">
                      {rp.shortDescription}
                    </p>
                  )}
                  <div className="mt-auto pt-2 border-t border-[color:var(--border-soft)] flex items-center justify-between">
                    <span className="font-heading font-bold text-sm text-[color:var(--brand-primary)] tabular-nums">
                      {fmt(rp.price)}
                    </span>
                    <ArrowUpRight size={13} className="text-[color:var(--text-muted)] group-hover:text-[color:var(--brand-primary)] transition-colors" aria-hidden="true" />
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}