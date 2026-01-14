import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findFirst({
    where: { slug: params.slug, published: true },
    select: { name: true, description: true, imageUrl: true },
  });

  if (!product) return {};

  return {
    title: `${product.name} | Vedic Wellness Products`,
    description:
      product.description ??
      "Explore this Ayurvedic product from Vedic Wellness (Innovia Drugs).",
    alternates: { canonical: `/products/${params.slug}` },
    openGraph: product.imageUrl
      ? {
          title: product.name,
          description:
            product.description ??
            "Explore this Ayurvedic product from Vedic Wellness.",
          images: [{ url: product.imageUrl }],
        }
      : undefined,
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const product = await prisma.product.findFirst({
    where: { slug: params.slug, published: true },
  });

  if (!product) return notFound();

  // replace later when you buy domain
  const baseUrl = "https://yourdomain.com";

  // ✅ Product schema for rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ?? "Ayurvedic product by Vedic Wellness (Innovia Drugs).",
    image: product.imageUrl ? [product.imageUrl] : undefined,
    brand: {
      "@type": "Brand",
      name: "Vedic Wellness",
    },
    sku: product.id,
    url: `${baseUrl}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price ?? undefined,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-6xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        {/* ✅ schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Chips */}
        <div className="flex flex-wrap gap-3">
          <Chip>Products</Chip>
          <Chip>Ayurvedic</Chip>
          <Chip>PCD Ready</Chip>
          <Chip>Fast Dispatch</Chip>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Image */}
          <GlassCard className="overflow-hidden">
            <div className="relative aspect-[4/3] w-full">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} Ayurvedic Product`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-slate-200/40 dark:bg-slate-800/40 flex items-center justify-center text-sm text-slate-600 dark:text-slate-300">
                  No image available
                </div>
              )}
            </div>
          </GlassCard>

          {/* Content */}
          <GlassCard className="p-7 md:p-10">
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              {product.name}
            </h1>

            <p className="mt-4 font-body text-slate-700 dark:text-slate-300 leading-relaxed">
              {product.description ?? "High-demand Ayurvedic formulation."}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-lg font-extrabold text-green-700 dark:text-green-300">
                {product.price !== null ? `₹${product.price}` : "Price on request"}
              </div>

              <div className="text-sm text-slate-500 dark:text-slate-400">
                SKU: {product.id.slice(0, 8).toUpperCase()}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                onClick={() =>
                  window.open("https://wa.me/910000000000", "_blank")
                }
              >
                Get Details on WhatsApp
              </Button>

              <Button variant="secondary">Download Catalog</Button>
            </div>

            {/* extra info */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                ✅ WHO-GMP Quality
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                ✅ Monopoly Available
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                ✅ Marketing Support
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                ✅ Fast Dispatch
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
