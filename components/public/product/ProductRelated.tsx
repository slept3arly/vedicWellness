"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, PackageSearch } from "lucide-react";

import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { fadeUpSoft, staggerSlow } from "@/app/animations";
import { RelatedProduct } from "./types";

export default function ProductRelated({ relatedProducts }: { relatedProducts: RelatedProduct[] }) {
  if (!relatedProducts.length) return null;

  return (
    <motion.div
      variants={staggerSlow}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-8 mt-16"
    >
      {/* Header with Heading Component and View All Link */}
      <div className="flex items-end justify-between border-b border-foreground/5 pb-4">
        <div className="flex items-center gap-3">
          <PackageSearch size={26} className="text-foreground" />
          <SectionHeading title="Related Products" />
        </div>
        <Link
          href="/products"
          className="font-accent text-xs font-bold text-[color:var(--brand-accent)] flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest"
        >
          View All <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {relatedProducts.map((rp) => (
          <motion.div key={rp.id} variants={fadeUpSoft}>
            <Link href={`/products/${rp.slug}`} className="group block h-full">
              <Card className="bg-white/75 dark:bg-black/45 h-full p-3 flex flex-col transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[color:var(--brand-primary)]/10">
                {/* Product Image */}
                {rp.imageUrl && (
                  <div className="relative w-full h-40 overflow-hidden rounded-xl mb-4 bg-muted/10">
                    <Image
                      src={rp.imageUrl}
                      alt={rp.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                )}

                {/* Content Container */}
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-heading text-sm md:text-base font-extrabold line-clamp-2 group-hover:text-[color:var(--brand-accent)] transition-colors leading-tight">
                      {rp.name}
                    </h3>
                    <div className="p-1.5 rounded-lg bg-foreground/5 group-hover:bg-[color:var(--brand-accent)]/10 transition-colors">
                      <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-[color:var(--brand-accent)]" />
                    </div>
                  </div>

                  {rp.shortDescription && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                      {rp.shortDescription}
                    </p>
                  )}

                  {/* Price at Bottom */}
                  <div className="mt-auto pt-2 border-t border-foreground/5">
                    <span className="font-heading font-bold text-[color:var(--brand-accent)] text-base">
                      ₹{rp.price}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}