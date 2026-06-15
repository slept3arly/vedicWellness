import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
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
export const revalidate = 86400;
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const product = await getPublicProductMetadataService(slug);
  if (!product) return {};

  return {
  title: `${product.name} | Vedic Wellness Products`,
  description:
    product.shortDescription ??
    "Explore this Ayurvedic product from Vedic Wellness.",

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "/products",
  },
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

  const session = await auth();
  
  // Data to pass to Client Component
  let existingQty = 0;
  let cartItemId: string | undefined = undefined;

  if (session?.user?.id) {
    const cart = await getOrCreateCart(session.user.id);
    const existingItem = cart.items.find(
      (item) => item.productId === product.id
    );
    
    if (existingItem) {
      existingQty = existingItem.quantity;
      cartItemId = existingItem.id; // Capture the DB ID for the client update logic
    }
  }

  return (
    <SlugClient
      product={product}
      relatedProducts={relatedProducts}
      existingQty={existingQty}
      cartItemId={cartItemId}
    />
  );
}