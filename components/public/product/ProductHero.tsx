"use client";

import { motion } from "framer-motion";
import {
  Target,
  Zap,
  FileText,
  Info,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import ProductCarousel from "./ProductCarousel";
import ProductPriceCard from "../../customer/product/ProductPriceCard";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
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
              <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/60">
                Category
              </p>
              <p className="font-heading text-xl font-semibold text-foreground">
                {product.tag || "Natural Care"}
              </p>
            </div>
          </motion.div>

          {/* Center */}
          <motion.div variants={reveal} className="text-center">
            <PageHeader 
              title={product.name} 
              subtitle={product.subtitle || ""} 
              className="pt-2"
            />
          </motion.div>

          {/* Right */}
          <motion.div
            variants={reveal}
            className="hidden lg:flex flex-col items-end pb-2"
          >
            <div className="border-t border-foreground/30 pt-3 text-right w-full">
              <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/60">
                Form
              </p>
              <p className="font-heading text-xl font-semibold text-foreground">
                {product.medicineForm || "—"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CORE */}
      <section className="pt-10">
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
                  <div className="flex items-center gap-3">
                    <Info size={26} className="text-foreground" />
                    <SectionHeading title="The Essence" />
                  </div>

                  <Card className="p-6 lg:p-8">
                    <p className="text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-300">
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
                  <div className="flex items-center gap-3">
                    <FileText size={26} className="text-foreground" />
                    <SectionHeading title="Inside the Formulation" />
                  </div>

                  <Card className="p-6 lg:p-8">
                    <p className="text-base lg:text-lg leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
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
                  <h3 className="font-heading text-xl font-semibold text-foreground uppercase tracking-[0.2em] text-sm">
                    Highlights
                  </h3>

                  <Card className="p-5">
                    <div className="space-y-4">
                      {product.highlights.map((point, idx) => (
                        <div key={idx} className="flex gap-3 text-slate-600 dark:text-slate-300">
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
                  <h3 className="font-heading text-xl font-semibold text-foreground uppercase tracking-[0.2em] text-sm">
                    Key Benefits
                  </h3>

                  <Card className="p-5">
                    <ul className="space-y-3">
                      {product.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
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