import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import GlassCard from "@/components/old_files/ui/GlassCard";
import Chip from "@/components/public/ui/Chip";
import Button from "@/components/public/ui/Button"; 

type Props = {
  params: Promise<{ slug: string }>;
};

function arr(v: any): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
  return [];
}

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
      "Explore this Ayurvedic product from Vedic Wellness (Innovia Drugs).",
    alternates: { canonical: `/products/${slug}` },
    openGraph: product.imageUrl
      ? {
          title: product.name,
          description:
            product.shortDescription ??
            "Explore this Ayurvedic product from Vedic Wellness.",
          images: [{ url: product.imageUrl }],
        }
      : undefined,
  };
}

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

  const baseUrl = "https://vedic-wellness.vercel.app";

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
      "Ayurvedic product by Vedic Wellness (Innovia Drugs).",
    image: allImages.length ? allImages : undefined,
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
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-6xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        <script
   
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>


        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Chip>Products</Chip>
            <Chip>Ayurvedic</Chip>
            <Chip>PCD Ready</Chip>
            <Chip>Fast Dispatch</Chip>
          </div>

          <Link
            href="/products"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            ← Back to products
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* ✅ Cover + Gallery */}
          <div className="space-y-4">
            <GlassCard className="overflow-hidden">
              <div className="relative aspect-[4/3] w-full">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={`${product.name}`}
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

            {gallery.length ? (
              <div className="grid grid-cols-4 gap-3">
                {gallery.slice(0, 4).map((url, i) => (
                  <GlassCard key={url + i} className="overflow-hidden">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={url}
                        alt={`${product.name} gallery ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : null}
          </div>

          {/* ✅ Content */}
          <GlassCard className="p-7 md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {product.name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tag ? (
                    <span className="inline-flex items-center rounded-full border border-green-600/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-800 dark:text-green-200">
                      {product.tag}
                    </span>
                  ) : null}

                  {product.medicineForm ? (
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                      {String(product.medicineForm).toLowerCase()}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold text-green-700 dark:text-green-300">
                  ₹{product.price}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  SKU: {product.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>

            <p className="mt-5 font-body text-slate-700 dark:text-slate-300 leading-relaxed">
              {product.shortDescription ?? "Premium Ayurvedic formulation."}
            </p>

            {/* packaging */}
            {packaging.length ? (
              <div className="mt-7 rounded-2xl border border-slate-200 bg-white/60 p-4 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                <div className="font-bold mb-2">Packaging</div>
                <ul className="list-disc pl-5 space-y-1">
                  {packaging.slice(0, 6).map((x, i) => (
                    <li key={x + i}>{x}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/+919306025799"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="primary">Get Details on WhatsApp</Button>
              </a>

              <Button variant="secondary">Request Franchise Price</Button>
            </div>

            {/* trust boxes */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "✅ WHO-GMP Quality",
                "✅ Monopoly Available",
                "✅ Marketing Support",
                "✅ Fast Dispatch",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
                >
                  {t}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ✅ Sections */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-6 md:p-8">
            <h2 className="font-heading text-lg font-extrabold text-slate-900 dark:text-white">
              Indications
            </h2>
            {indications.length ? (
              <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {indications.map((x, i) => (
                  <li key={x + i}>{x}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                No indications added yet.
              </p>
            )}
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-heading text-lg font-extrabold text-slate-900 dark:text-white">
              Ingredients
            </h2>
            {ingredients.length ? (
              <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {ingredients.map((x, i) => (
                  <li key={x + i}>{x}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                No ingredients added yet.
              </p>
            )}
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-heading text-lg font-extrabold text-slate-900 dark:text-white">
              Directions to Use
            </h2>
            {directions.length ? (
              <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {directions.map((x, i) => (
                  <li key={x + i}>{x}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                No directions added yet.
              </p>
            )}
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-heading text-lg font-extrabold text-slate-900 dark:text-white">
              Contraindications
            </h2>
            {contraindications.length ? (
              <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {contraindications.map((x, i) => (
                  <li key={x + i}>{x}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                No contraindications added yet.
              </p>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
