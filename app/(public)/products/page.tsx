import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { getPublicProductsService } from "@/lib/services/productService";
import { notFound } from "next/navigation";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Products | Vedic Wellness - Ayurvedic Franchise Product Range",
    description:
      "Browse Ayurvedic products from Vedic Wellness.",
    alternates: {
      canonical: "/products",
    },
  };
}

// Product listings update periodically
export const revalidate = 21600; // 6 hours

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

  const rawPage = Number(getParam(sp.page) ?? "1");

  if (!Number.isInteger(rawPage) || rawPage < 1) {
    notFound();
  }

  const page = rawPage;
  const query = (getParam(sp.query) ?? "").trim();
  const sort = getParam(sp.sort) ?? "name_asc";

  const { products, total, totalPages } =
    await getPublicProductsService({
      page,
      query,
      sort,
    });

  if (totalPages > 0 && page > totalPages) {
    notFound();
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vedic Wellness Product Catalog",
    description:
      "Catalog of Ayurvedic products offered by Vedic Wellness.",
    url: `${SITE_URL}/products`,
    numberOfItems: total,

    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: (page - 1) * 10 + index + 1,
      name: product.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
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