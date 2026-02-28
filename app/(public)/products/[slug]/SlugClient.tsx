"use client";

import ProductHero from "@/components/customer/product/ProductHero";
import ProductDetailsAccordion from "@/components/customer/product/ProductDetailsAccordion";
import ProductSpecification from "@/components/customer/product/ProductSpecification";
import ProductFAQ from "@/components/customer/product/ProductFAQ";
import ProductReviews from "@/components/customer/product/ProductReviews";
import ProductRelated from "@/components/customer/product/ProductRelated";
import { Product, RelatedProduct } from "@/components/customer/product/types";

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