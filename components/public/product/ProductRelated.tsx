"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import Card from "@/components/public/ui/Card";
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
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-black">Related Products</h2>
        <Link
          href="/products"
          className="text-xs font-bold text-accent flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {relatedProducts.map((rp) => (
          <motion.div key={rp.id} variants={fadeUpSoft}>
            <Link href={`/products/${rp.slug}`} className="group block h-full">
              <Card className="bg-white/75 dark:bg-black/45 h-full p-3 flex flex-col">
                {rp.imageUrl && (
                  <div className="relative w-full h-32 overflow-hidden rounded-xl mb-3">
                    <Image
                      src={rp.imageUrl}
                      alt={rp.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start gap-1.5 flex-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-[12px] font-extrabold line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                      {rp.name}
                    </h3>
                    {rp.shortDescription && (
                      <p className="text-[10px] text-muted line-clamp-2 mt-0.5 leading-tight">
                        {rp.shortDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <div className="p-1 rounded-lg bg-muted/5 group-hover:bg-accent/10 group-hover:scale-110 transition-all">
                      <ArrowUpRight size={13} className="text-muted group-hover:text-accent" />
                    </div>
                    <span className="font-bold text-accent text-[12px]">₹{rp.price}</span>
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