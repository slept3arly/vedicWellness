"use client";

import { motion } from "framer-motion";
import {
  Target,
  Zap,
  FileText,
  Info,
  Plus,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import ProductCarousel from "./ProductCarousel";
import ProductPriceCard from "./ProductPriceCard";
import { Product } from "./types";
import { staggerFast, fadeUp, reveal } from "@/app/animations";

export default function ProductHero({
  product,
  existingQty,
}: {
  product: Product;
  existingQty: number;
}) {
  const allImages = [product.imageUrl, ...(product.gallery ?? [])].filter(
    Boolean
  ) as string[];

  return (
    <div className="bg-background">
      
      {/* HEADER */}
      <section className="pt-2 pb-1">
        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-6 items-end"
        >
          {/* Left */}
          <motion.div variants={reveal} className="hidden lg:block pb-2">
            <div className="border-t border-foreground/30 pt-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/60 font-[var(--font-inter)]">
                Category
              </p>
              <p className="text-xl font-bold text-foreground font-[var(--font-space-grotesk)]">
                {product.tag || "Natural Care"}
              </p>
            </div>
          </motion.div>

          {/* Center */}
          <motion.div variants={reveal} className="text-center">
            <h1 className="pt-2 text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.9] tracking-tighter text-foreground font-[var(--font-space-grotesk)]">
              {product.name}
            </h1>

            {product.subtitle && (
              <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-foreground/70 font-[var(--font-inter)]">
                {product.subtitle}
              </p>
            )}
          </motion.div>

          {/* Right */}
          <motion.div
            variants={reveal}
            className="hidden lg:flex flex-col items-end pb-2"
          >
            <div className="border-t border-foreground/30 pt-3 text-right w-full">
              <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/60 font-[var(--font-inter)]">
                Form
              </p>
              <p className="text-xl font-bold text-foreground font-[var(--font-space-grotesk)]">
                {product.medicineForm || "—"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div className="pt-6 pb-6">
        <div className="flex items-center gap-4 opacity-80">
          <div className="h-px bg-foreground/30 flex-1" />
          <div className="w-6 h-6 flex items-center justify-center border border-foreground/30 text-foreground/60 shrink-0">
            <Plus size={12} />
          </div>
          <div className="h-px bg-foreground/30 flex-1" />
        </div>
      </div>

      {/* CORE */}
      <section className="pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 xl:col-span-8"
          >
            <div className="w-full aspect-[16/9] relative">
              <ProductCarousel images={allImages} name={product.name} />
            </div>
          </motion.div>

          {/* Price Card (not sticky) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 xl:col-span-4"
          >
            <ProductPriceCard product={product} existingQty={existingQty} />
          </motion.div>
        </div>
      </section>

      {/* DATA SECTION */}
      <section className="py-8 bg-muted/5">
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* LEFT CONTENT */}
            <div className="lg:col-span-8 space-y-8">
              
              {product.shortDescription && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground font-[var(--font-space-grotesk)]">
                    <Info size={26} />
                    The Essence
                  </h2>

                  <Card className="p-6 lg:p-8">
                    <p className="text-lg lg:text-xl leading-relaxed text-foreground/70 font-[var(--font-inter)]">
                      {product.shortDescription}
                    </p>
                  </Card>
                </motion.div>
              )}

              {product.longDescription && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground font-[var(--font-space-grotesk)]">
                    <FileText size={26} />
                    Inside the Formulation
                  </h2>

                  <Card className="p-6 lg:p-8">
                    <p className="text-base lg:text-lg leading-relaxed text-foreground/70 whitespace-pre-wrap font-[var(--font-inter)]">
                      {`Our proprietary ${product.medicineForm?.toLowerCase() || "formulation"} is engineered to provide targeted therapeutic benefits using a blend of high-purity ingredients and advanced manufacturing standards. Whether designed for preventive care or chronic management, this product reflects our commitment to quality, safety, and efficacy.\n\nProcessed in state-of-the-art facilities, it ensures maximum bioavailability and consistent results, making it a trusted choice for healthcare professionals and patients alike. By combining traditional wisdom with modern pharmacological precision, we deliver a solution that supports long-term health and vitality without compromising on safety standards.`}
                    </p>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-4 space-y-8">
              
              {product.highlights?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-foreground font-[var(--font-space-grotesk)]">
                    Highlights
                  </h3>

                  <Card className="p-5">
                    <div className="space-y-4">
                      {product.highlights.map((point, idx) => (
                        <div key={idx} className="flex gap-3 text-foreground/70 font-[var(--font-inter)]">
                          <Target size={16} className="shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {product.benefits?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-foreground font-[var(--font-space-grotesk)]">
                    Key Benefits
                  </h3>

                  <Card className="p-5">
                    <ul className="space-y-3">
                      {product.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-foreground/70 font-[var(--font-inter)]">
                          <Zap size={14} className="shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}