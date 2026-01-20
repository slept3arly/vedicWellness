import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Products | Vedic Wellness - Ayurvedic Franchise Product Range",
  description:
    "Browse Ayurvedic products from Vedic Wellness (Innovia Drugs) for PCD pharma franchise partners. High-demand products, monopoly rights & fast dispatch.",
  alternates: { canonical: "/products" },
};

const PAGE_SIZE = 10;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const where = { published: true };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        slug: true,
        tag: true,
        price: true,
        imageUrl: true,
        shortDescription: true,
        createdAt: true,
        medicineForm: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vedic Wellness Products",
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: (page - 1) * PAGE_SIZE + index + 1,
      name: p.name,
      url: `https://vedic-wellness.vercel.app/products/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProductsClient
        products={products}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        totalCount={total}
      />
    </>
  );
}
