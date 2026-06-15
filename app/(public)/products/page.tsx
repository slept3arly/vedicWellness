import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { getPublicProductsService } from "@/lib/services/productService";

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

  const page = Math.max(1, Number(getParam(sp.page)) || 1);
  const query = (getParam(sp.query) ?? "").trim();
  const sort = getParam(sp.sort) ?? "name_asc";

  const { products, total, totalPages } =
    await getPublicProductsService({
      page,
      query,
      sort,
    });

  return (
    <ProductsClient
      products={products}
      page={page}
      totalPages={totalPages}
      totalCount={total}
      query={query}
      sort={sort}
    />
  );
}