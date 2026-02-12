import { prisma } from "@/lib/db/prisma";
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

/* ------------------------------------------------------------------ */
/* Types & helpers */
/* ------------------------------------------------------------------ */

type Props = {
  params: Promise<{ slug: string }>;
};

function arr(v: any): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
  return [];
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

/* ------------------------------------------------------------------ */
/* Metadata */
/* ------------------------------------------------------------------ */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const product = await prisma.product.findFirst({
    where: { slug, published: true },
    select: { name: true, shortDescription: true, imageUrl: true },
  });

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

export default async function ProductDetailsPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const product = await prisma.product.findFirst({
    where: { slug, published: true },
  });

  if (!product) return notFound();

  const gallery = arr(product.gallery);
  const packaging = arr(product.packaging);

  /* ------------------------------------------------------------------ */
  /* Fetch existing cart quantity safely */
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
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-20 space-y-10">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Chip>Products</Chip>
            <Chip>Ayurvedic</Chip>
            <Chip>PCD Ready</Chip>
            <Chip>Fast Dispatch</Chip>
          </div>

          <Link
            href="/products"
            className="text-sm font-semibold text-muted hover:text-[color:var(--brand-accent)]"
          >
            ← Back to products
          </Link>
        </div>

        {/* Main */}
        <div className="grid gap-6 lg:grid-cols-2">

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
                {gallery.slice(0, 4).map((url, i) => (
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

          {/* Content */}
          <Card>
            <div className="flex justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-extrabold">
                  {product.name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tag && <Chip>{product.tag}</Chip>}
                  {product.medicineForm && (
                    <Chip>{product.medicineForm}</Chip>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold text-[color:var(--brand-accent)]">
                  ₹{product.price.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-muted">
                  SKU: {product.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>

            <p className="mt-5 text-muted leading-relaxed">
              {product.shortDescription ??
                "Premium Ayurvedic formulation."}
            </p>

            {/* Purchase Section */}
            <ProductPurchaseCard
              productId={product.id}
              tag={product.tag}
              medicineForm={product.medicineForm}
              existingQty={existingQty}
            />

            {/* Secondary Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/+919306025799"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary">
                  Get Details on WhatsApp
                </Button>
              </a>

              <Button variant="secondary">
                Request Franchise Price
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
