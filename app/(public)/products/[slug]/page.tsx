import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";
import Button from "@/components/public/ui/Button";

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
    openGraph: product.imageUrl
      ? {
          title: product.name,
          description: product.shortDescription ?? "",
          images: [{ url: product.imageUrl }],
        }
      : undefined,
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
    select: {
      id: true,
      name: true,
      slug: true,
      tag: true,
      price: true,
      imageUrl: true,
      gallery: true,
      medicineForm: true,
      packaging: true,
      shortDescription: true,
      indications: true,
      ingredients: true,
      directionsToUse: true,
      contraindications: true,
    },
  });

  if (!product) return notFound();

  const gallery = arr(product.gallery);
  const indications = arr(product.indications);
  const ingredients = arr(product.ingredients);
  const directions = arr(product.directionsToUse);
  const contraindications = arr(product.contraindications);
  const packaging = arr(product.packaging);

  const allImages = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...gallery,
  ].slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.shortDescription ??
      "Ayurvedic product by Vedic Wellness.",
    image: allImages.length ? allImages : undefined,
    brand: {
      "@type": "Brand",
      name: "Vedic Wellness",
    },
    sku: product.id,
    url: `${SITE_URL}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-20 space-y-10">

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

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
                    sizes="(max-width: 1024px) 100vw, 50vw"
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
                        sizes="25vw"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <Card>
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-extrabold">
                  {product.name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tag && (
                    <Chip>{product.tag}</Chip>
                  )}
                  {product.medicineForm && (
                    <Chip>{String(product.medicineForm).toLowerCase()}</Chip>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold text-[color:var(--brand-accent)]">
                  ₹{product.price}
                </div>
                <div className="mt-1 text-xs text-muted">
                  SKU: {product.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>

            <p className="mt-5 text-muted leading-relaxed">
              {product.shortDescription ?? "Premium Ayurvedic formulation."}
            </p>

            {packaging.length > 0 && (
              <div className="mt-7 rounded-xl border border-[var(--border-soft)] p-4 text-sm">
                <div className="font-semibold mb-2">Packaging</div>
                <ul className="list-disc pl-5 space-y-1">
                  {packaging.slice(0, 6).map((x, i) => (
                    <li key={x + i}>{x}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/+919306025799"
                target="_blank"
                rel="noreferrer"
              >
                <Button>Get Details on WhatsApp</Button>
              </a>

              <Button variant="secondary">
                Request Franchise Price
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 text-sm">
              {[
                "WHO-GMP Quality",
                "Monopoly Available",
                "Marketing Support",
                "Fast Dispatch",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-4"
                >
                  ✅ {t}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            ["Indications", indications],
            ["Ingredients", ingredients],
            ["Directions to Use", directions],
            ["Contraindications", contraindications],
          ].map(([title, list]) => (
            <Card key={title as string}>
              <h2 className="font-heading text-lg font-extrabold">
                {title}
              </h2>

              {(list as string[]).length > 0 ? (
                <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-muted">
                  {(list as string[]).map((x, i) => (
                    <li key={x + i}>{x}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  No information added yet.
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
