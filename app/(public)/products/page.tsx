import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { getPublicProductsService } from "@/lib/services/productService";

export const metadata: Metadata = {
  title: "Products | Vedic Wellness - Ayurvedic Franchise Product Range",
  description: "Browse Ayurvedic products from Vedic Wellness.",
  alternates: { canonical: "/products" },
};

// CRITICAL: Search depends on URL params; it cannot be force-static.
export const dynamic = "force-dynamic";

type SearchParams = {
  page?: string;
  query?: string;
  sort?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const getParam = (v?: string | string[]) =>
    Array.isArray(v) ? v[v.length - 1] : v;

  const page = Math.max(1, Number(getParam(sp.page)) || 1);
  const query = (getParam(sp.query) ?? "").trim();
  const sort = getParam(sp.sort) ?? "name_asc";

  const { products, total, totalPages, pageSize } =
    await getPublicProductsService({
      page,
      query,
      sort,
    });

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
        totalCount={total}
        query={query}
        sort={sort}
      />
    </>
  );
}