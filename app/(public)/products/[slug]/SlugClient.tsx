"use client";

import ProductHero from "@/components/public/product/ProductHero";
import ProductDetailsAccordion from "@/components/public/product/ProductDetailsAccordion";
import ProductSpecification from "@/components/public/product/ProductSpecification";
import ProductFAQ from "@/components/public/product/ProductFAQ";
import ProductReviews from "@/components/public/product/ProductReviews";
import ProductRelated from "@/components/public/product/ProductRelated";
import { Product, RelatedProduct } from "@/components/public/product/types";

export type { Product, RelatedProduct };

export default function SlugClient({
  product,
  relatedProducts,
  existingQty,
}: {
  product: Product;
  relatedProducts: RelatedProduct[];
  existingQty: number;
}) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 py-4 md:py-8 space-y-10">

        <ProductHero product={product} existingQty={existingQty} />

        <div className="space-y-10">
          <ProductDetailsAccordion product={product} />
          <ProductSpecification product={product} />
          <ProductFAQ faqs={product.faqs ?? []} />
          <ProductReviews reviews={product.reviews ?? []} />
          <ProductRelated relatedProducts={relatedProducts} />
        </div>

      </div>
    </section>
  );
}