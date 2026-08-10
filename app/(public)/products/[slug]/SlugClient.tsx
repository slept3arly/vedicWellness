"use client";

import { motion } from "framer-motion";
import {
  Heart,
  UserCheck,
  ShieldCheck,
  Stethoscope,
  Zap,
  Truck,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";

import ProductHero from "@/components/public/product/ProductHero";
import ProductDetailsAccordion from "@/components/public/product/ProductDetailsAccordion";
import ProductSpecification from "@/components/public/product/ProductSpecification";
import ProductFAQ from "@/components/public/product/ProductFAQ";
import ProductReviews from "@/components/public/product/ProductReviews";
import ProductRelated from "@/components/public/product/ProductRelated";
import ProductPurchaseCard from "@/components/customer/product/ProductPurchaseCard";

import { staggerFast, fadeUpSoft } from "@/app/animations";
import { Product, RelatedProduct } from "@/components/public/product/types";

const audienceIcons = [Heart, UserCheck, ShieldCheck, Stethoscope];

interface SlugClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
  existingQty: number;
  cartItemId?: string;
}

export default function SlugClient({
  product,
  relatedProducts,
  existingQty,
  cartItemId,
}: SlugClientProps) {
  return (
    <section className="w-full pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >

          {/* ================= HERO ================= */}
          <motion.div variants={fadeUpSoft} className="pt-6 md:pt-8">
            <ProductHero product={product} />
          </motion.div>

          {/* ================= MOBILE PURCHASE ================= */}
          <div className="lg:hidden">
            <ProductPurchaseCard
              productId={product.id}
              existingQty={existingQty}
              cartItemId={cartItemId}
              tag={product.tag}
              medicineForm={product.medicineForm}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              stock={product.stock}
            />
          </div>

          {/* ================= MAIN GRID ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ================= LEFT ================= */}
            <div className="lg:col-span-2 space-y-6">

              {/* BENEFITS */}
              {(product.benefits?.length > 0 || product.highlights?.length > 0) && (
                <motion.div variants={fadeUpSoft}>
                  <Card className="p-0">
                    <div className="px-5 pt-5 pb-4 border-b border-[color:var(--border-soft)] flex items-center gap-2">
                      <Zap size={15} className="text-[color:var(--brand-primary)]" />
                      <h2 className="font-heading text-sm uppercase tracking-widest text-[color:var(--text-muted)]">
                        Key Benefits
                      </h2>
                    </div>

                    <ul className="px-5 py-4 grid sm:grid-cols-2 gap-3">
                      {[...(product.benefits ?? []), ...(product.highlights ?? [])].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Zap size={12} className="mt-1 text-[color:var(--brand-primary)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              )}

              {/* 👈 MOVED HERE */}
              {product.whoShouldUse?.length > 0 && (
                <motion.div variants={fadeUpSoft} className="space-y-4">
                  <SectionHeading title="Who Should Use This?" align="left" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.whoShouldUse.map((w, i) => {
                      const Icon = audienceIcons[i % audienceIcons.length];
                      return (
                        <Card key={i} className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon size={16} className="mt-1 text-[color:var(--brand-primary)]" />
                            <p className="text-sm">{w}</p>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* DETAILS */}
              <motion.div variants={fadeUpSoft}>
                <ProductDetailsAccordion product={product} />
              </motion.div>

              {/* SPECIFICATIONS */}
              <motion.div variants={fadeUpSoft}>
                <ProductSpecification product={product} />
              </motion.div>

              {/* FAQ */}
              <motion.div variants={fadeUpSoft}>
                <ProductFAQ faqs={product.faqs ?? []} />
              </motion.div>

              {/* REVIEWS */}
              <motion.div variants={fadeUpSoft}>
                <ProductReviews reviews={product.reviews ?? []} />
              </motion.div>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="hidden lg:block">

              {/* ONLY THIS IS STICKY */}
              <div className="sticky top-44 space-y-4">

                <ProductPurchaseCard
                  productId={product.id}
                  existingQty={existingQty}
                  cartItemId={cartItemId}
                  tag={product.tag}
                  medicineForm={product.medicineForm}
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  stock={product.stock}
                />

                {/* TRUST */}
                {product.trustBadges?.length > 0 && (
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-xs uppercase tracking-widest text-muted">
                        Quality Assurance
                      </span>
                    </div>

                    <ul className="space-y-2 text-sm">
                      {[
                        { icon: Truck, label: "Free Delivery" },
                        { icon: ShieldCheck, label: "100% Genuine" },
                        ...product.trustBadges.map((b) => ({
                          icon: ShieldCheck,
                          label: b,
                        })),
                      ].map(({ icon: Icon, label }, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Icon size={13} className="text-emerald-500" />
                          {label}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* QUICK INFO */}
                <Card className="p-4">
                  <span className="text-xs uppercase tracking-widest text-muted">
                    Quick Info
                  </span>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Form</span>
                      <span className="font-semibold">{product.medicineForm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brand</span>
                      <span className="font-semibold">{product.company?.name ?? "Vedic Wellness"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category</span>
                      <span className="font-semibold">{product.tag}</span>
                    </div>
                  </div>
                </Card>

              </div>
            </div>

          </div>

          {/* RELATED */}
          {relatedProducts.length > 0 && (
            <motion.div variants={fadeUpSoft}>
              <ProductRelated relatedProducts={relatedProducts} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
