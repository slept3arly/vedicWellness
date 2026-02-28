import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getSession } from "@/lib/auth/getSession";
import { getOrCreateCart } from "@/lib/services/cartService";

import {
  getPublicProductBySlugService,
  getPublicProductMetadataService,
  getRelatedProductsService,
} from "@/lib/services/productService";

import SlugClient from "./SlugClient";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type Props = {
  params: Promise<{ slug: string }>;
};

/* ------------------------------------------------------------------ */
/* Metadata */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const session = await getSession();
  if (!session?.user) return {};

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const product = await getPublicProductMetadataService(slug);
  if (!product) return {};

  return {
    title: `${product.name} | Vedic Wellness Products`,
    description:
      product.shortDescription ??
      "Explore this Ayurvedic product from Vedic Wellness.",
    alternates: { canonical: `/products/${slug}` },
  };
}

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default async function ProductDetailsPage({
  params,
}: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const product = await getPublicProductBySlugService(slug);
  if (!product) return notFound();

  const relatedProducts = await getRelatedProductsService(
    slug,
    product.id,
    product.tag ?? null,
    product.medicineForm ?? null
  );

  const session = await getSession();
  let existingQty = 0;

  if (session?.user?.id) {
    const cart = await getOrCreateCart(session.user.id);
    const existingItem = cart.items.find(
      (item) => item.productId === product.id
    );
    existingQty = existingItem?.quantity ?? 0;
  }

  return (
    <SlugClient
      product={product}
      relatedProducts={relatedProducts}
      existingQty={existingQty}
    />
  );
}