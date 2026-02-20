import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { getPublicProductsService } from "@/lib/services/productService";

export const metadata: Metadata = {
  title: "Products | Vedic Wellness - Ayurvedic Franchise Product Range",
  description:
    "Browse Ayurvedic products from Vedic Wellness (Innovia Drugs) for PCD pharma franchise partners. High-demand products, monopoly rights & fast dispatch.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const { products, total, totalPages, pageSize } =
    await getPublicProductsService(page);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vedic Wellness Products",
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: (page - 1) * pageSize + index + 1,
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
        pageSize={pageSize}
        totalCount={total}
      />
    </>
  );
}