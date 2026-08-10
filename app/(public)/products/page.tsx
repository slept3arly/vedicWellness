import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { getPublicProductsService } from "@/lib/services/productService";
import { notFound } from "next/navigation";
import { getActiveCompanies } from "@/lib/db/company";

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
    openGraph: {
      type: "website",
      url: `${SITE_URL}/products`,
      title:
        "Products | Vedic Wellness - Ayurvedic Franchise Product Range",
      description:
        "Browse Ayurvedic products from Vedic Wellness.",
      siteName: "Vedic Wellness",
      images: [
        {
          url: `${SITE_URL}/og.jpg`,
          width: 1200,
          height: 630,
          alt: "Vedic Wellness Product Range",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Products | Vedic Wellness - Ayurvedic Franchise Product Range",
      description:
        "Browse Ayurvedic products from Vedic Wellness.",
      images: [`${SITE_URL}/og.jpg`],
    },
  };
}

// Product listings update periodically
export const revalidate = 21600; // 6 hours

type SearchParams = {
  page?: string;
  query?: string;
  sort?: string;
  company?: string;
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
  const company = getParam(sp.company) ?? "";
  const effectiveCompany = company || "vedic-wellness";

  const [result, companies] = await Promise.all([
    getPublicProductsService({ page, query, sort, companySlug: effectiveCompany }),
    getActiveCompanies(),
  ]);
  const { products, total, totalPages } = result;
  const selectedCompany = companies.find((item) => item.slug === effectiveCompany);
  if (!selectedCompany) notFound();

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
        company={company}
        companyName={selectedCompany?.name ?? "Vedic Wellness"}
        companies={companies}
      />
    </>
  );
}
