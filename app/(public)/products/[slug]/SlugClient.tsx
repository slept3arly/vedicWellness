"use client";

import { motion } from "framer-motion";
import {
  Users,
  Heart,
  UserCheck,
  ShieldCheck,
  Stethoscope,
  Zap,
  Target,
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

// Using the logic-aware purchase card
import ProductPurchaseCard from "@/components/customer/product/ProductPurchaseCard";

import { staggerFast, fadeUpSoft } from "@/app/animations";
import { Product, RelatedProduct } from "@/components/public/product/types";

const audienceIcons = [Heart, UserCheck, ShieldCheck, Stethoscope];

interface SlugClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
  existingQty: number;
  cartItemId?: string; // Prop added to track the specific cart item ID
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
          className="space-y-6"
        >
          {/* ═══════════════════════════════════════
              1. HERO — Image and Product Info
          ═══════════════════════════════════════ */}
          <motion.div variants={fadeUpSoft}>
            <ProductHero product={product} />
          </motion.div>

          {/* ═══════════════════════════════════════
              2. PURCHASE CARD — Direct Logic
              Handles Add (new) vs Update (existing)
          ═══════════════════════════════════════ */}
          <motion.div variants={fadeUpSoft}>
            <ProductPurchaseCard 
              productId={product.id} 
              existingQty={existingQty} 
              cartItemId={cartItemId}
              tag={product.tag}
              medicineForm={product.medicineForm}
            />
          </motion.div>

          {/* ═══════════════════════════════════════
              3. BENEFITS + HIGHLIGHTS
          ═══════════════════════════════════════ */}
          {(product.benefits?.length > 0 || product.highlights?.length > 0) && (
            <motion.div
              variants={fadeUpSoft}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {product.benefits?.length > 0 && (
                <Card className="p-0">
                  <div className="px-5 pt-5 pb-4 border-b border-[color:var(--border-soft)] flex items-center gap-2">
                    <Zap size={15} className="text-[color:var(--brand-primary)]" aria-hidden="true" />
                    <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-[color:var(--text-muted)]">
                      Key Benefits
                    </h2>
                  </div>
                  <ul className="px-5 py-4 space-y-3">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-body text-[color:var(--text-main)]">
                        <Zap size={12} className="shrink-0 mt-0.5 text-[color:var(--brand-primary)]" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {product.highlights?.length > 0 && (
                <Card className="p-0">
                  <div className="px-5 pt-5 pb-4 border-b border-[color:var(--border-soft)] flex items-center gap-2">
                    <Target size={15} className="text-[color:var(--brand-primary)]" aria-hidden="true" />
                    <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-[color:var(--text-muted)]">
                      Highlights
                    </h2>
                  </div>
                  <ul className="px-5 py-4 space-y-3">
                    {product.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-body text-[color:var(--text-main)]">
                        <Target size={12} className="shrink-0 mt-0.5 text-[color:var(--brand-primary)]" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════
              4. TRUST BAR
          ═══════════════════════════════════════ */}
          {product.trustBadges?.length > 0 && (
            <motion.div variants={fadeUpSoft}>
              <Card className="p-0">
                <div className="px-5 pt-5 pb-4 border-b border-[color:var(--border-soft)] flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[color:var(--brand-primary)]" aria-hidden="true" />
                  <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-[color:var(--text-muted)]">
                    Quality Assurance
                  </h2>
                </div>
                <ul className="px-5 py-4 flex flex-wrap gap-x-6 gap-y-3">
                  {[
                    { icon: Truck, label: "Free Delivery" },
                    { icon: ShieldCheck, label: "100% Genuine" },
                    ...product.trustBadges.map((b) => ({ icon: ShieldCheck, label: b })),
                  ].map(({ icon: Icon, label }, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-body text-[color:var(--text-main)]">
                      <Icon size={13} className="shrink-0 text-emerald-500" aria-hidden="true" />
                      {label}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════
              5. ACCORDION — Details
          ═══════════════════════════════════════ */}
          <motion.div variants={fadeUpSoft}>
            <ProductDetailsAccordion product={product} />
          </motion.div>

          {/* ═══════════════════════════════════════
              6. SPECIFICATIONS
          ═══════════════════════════════════════ */}
          <motion.div variants={fadeUpSoft}>
            <ProductSpecification product={product} />
          </motion.div>

          {/* ═══════════════════════════════════════
              7. WHO SHOULD USE
          ═══════════════════════════════════════ */}
          {product.whoShouldUse?.length > 0 && (
            <motion.div variants={fadeUpSoft} className="space-y-4">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[color:var(--brand-primary)]" aria-hidden="true" />
                <SectionHeading title="Who Should Use This?" align="left" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.whoShouldUse.map((w, i) => {
                  const Icon = audienceIcons[i % audienceIcons.length];
                  return (
                    <Card key={i} className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon
                          size={16}
                          strokeWidth={2}
                          className="shrink-0 mt-0.5 text-[color:var(--brand-primary)]"
                          aria-hidden="true"
                        />
                        <p className="font-body text-sm text-[color:var(--text-main)] leading-snug">{w}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════
              8. FAQs
          ═══════════════════════════════════════ */}
          <motion.div variants={fadeUpSoft}>
            <ProductFAQ faqs={product.faqs ?? []} />
          </motion.div>

          {/* ═══════════════════════════════════════
              9. REVIEWS
          ═══════════════════════════════════════ */}
          <motion.div variants={fadeUpSoft}>
            <ProductReviews reviews={product.reviews ?? []} />
          </motion.div>

          {/* ═══════════════════════════════════════
              10. RELATED PRODUCTS
          ═══════════════════════════════════════ */}
          {relatedProducts.length > 0 && (
            <motion.div
              variants={fadeUpSoft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <ProductRelated relatedProducts={relatedProducts} />
            </motion.div>
          )}

        </motion.div>
      </div>
    </section>
  );
}