import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { prisma } from "@/lib/db/prisma"; // adjust import

export const metadata: Metadata = {
  title: "Products | Vedic Wellness - Ayurvedic Franchise Product Range",
  description:
    "Browse Ayurvedic products from Vedic Wellness (Innovia Drugs) for PCD pharma franchise partners. High-demand products, monopoly rights & fast dispatch.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vedic Wellness Products",
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: p.name,
      url: `https://yourdomain.com/products/${p.slug}`, // change later
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductsClient products={products} />
    </>
  );
}
