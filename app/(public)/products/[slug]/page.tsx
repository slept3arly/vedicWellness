import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";
import Button from "@/components/public/ui/Button";
import ProductPurchaseCard from "@/components/customer/product/ProductPurchaseCard";

import { getSession } from "@/lib/auth/getSession";
import { getOrCreateCart } from "@/lib/services/cartService";
import {
  getPublicProductBySlugService,
  getPublicProductMetadataService,
} from "@/lib/services/productService";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type Props = {
  params: Promise<{ slug: string }>;
};

function arr(v: any): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
  return [];
}

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

  const gallery = arr(product.gallery);
  const ingredients = arr(product.ingredients);
  const indications = arr(product.indications);
  const contraindications = arr(product.contraindications);
  const directions = arr(product.directionsToUse);
  const packaging = arr(product.packaging);

  /* ------------------------------------------------------------------ */
  /* Cart Info */
  /* ------------------------------------------------------------------ */

  const session = await getSession();
  let existingQty = 0;

  if (session?.user?.id) {
    const cart = await getOrCreateCart(session.user.id);
    const existingItem = cart.items.find(
      (item) => item.productId === product.id
    );
    existingQty = existingItem?.quantity ?? 0;
  }

  /* ------------------------------------------------------------------ */
  /* UI */
  /* ------------------------------------------------------------------ */

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-20 space-y-12">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            <Chip>Products</Chip>
            {product.tag && <Chip>{product.tag}</Chip>}
            {product.medicineForm && (
              <Chip>{product.medicineForm}</Chip>
            )}
          </div>

          <Link
            href="/products"
            className="text-sm font-semibold text-muted hover:text-[color:var(--brand-accent)]"
          >
            ← Back to products
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/3]">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-muted">
                    No image available
                  </div>
                )}
              </div>
            </Card>

            {gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((url, i) => (
                  <Card key={url + i} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={url}
                        alt={`${product.name} gallery ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <Card>
            <h1 className="text-3xl font-extrabold">
              {product.name}
            </h1>

            <div className="mt-3 text-2xl font-bold text-[color:var(--brand-accent)]">
              ₹{product.price.toLocaleString()}
            </div>

            {product.shortDescription && (
              <p className="mt-4 text-muted leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Purchase */}
            <div className="mt-6">
              <ProductPurchaseCard
                productId={product.id}
                tag={product.tag}
                medicineForm={product.medicineForm}
                existingQty={existingQty}
              />
            </div>

            {/* WhatsApp */}
            <div className="mt-6">
              <a
                href="https://wa.me/+919306025799"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary">
                  Get Details on WhatsApp
                </Button>
              </a>
            </div>
          </Card>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">

          {ingredients.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-3">
                Ingredients
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                {ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

          {indications.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-3">
                Indications
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                {indications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

          {contraindications.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-3">
                Contraindications
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                {contraindications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

          {directions.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-3">
                Directions to Use
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                {directions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

          {packaging.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-3">
                Packaging
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                {packaging.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

        </div>
      </div>
    </section>
  );
}