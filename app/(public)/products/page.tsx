import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { getPublicProductsService } from "@/lib/services/productService";
import { notFound } from "next/navigation";
import { getActiveCompanies } from "@/lib/db/company";
import ExpandableSeoContent from "@/components/public/ui/ExpandableSeoContent";
import SeoLink from "@/components/public/ui/SeoLink";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

const DEFAULT_SORT = "name_asc";
const DEFAULT_COMPANY = "vedic-wellness";

const PAGE_TITLE = "Ayurvedic Products – PCD Pharma Franchise Range";
const PAGE_DESCRIPTION =
  "Browse Ayurvedic products from Vedic Wellness.";

type SearchParams = {
  page?: string;
  query?: string;
  sort?: string;
  company?: string;
};

const getParam = (v?: string | string[]) =>
  Array.isArray(v) ? v[v.length - 1] : v;

// The URL matching the actually rendered product listing (used for ItemList JSON-LD).
function buildRenderedUrl(opts: {
  page?: number;
  query?: string;
  sort?: string;
  company?: string;
}) {
  const params = new URLSearchParams();
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  if (opts.query) params.set("query", opts.query);
  if (opts.sort && opts.sort !== DEFAULT_SORT) params.set("sort", opts.sort);
  if (opts.company && opts.company !== DEFAULT_COMPANY)
    params.set("company", opts.company);
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

// The canonical URL for the current listing state.
// - /products for the default Vedic Wellness listing (incl. pagination)
// - /products?company=<slug> for genuinely distinct public company listings
//   (these must not canonicalize to /products — different content)
// - search/sort variants are noindex and canonicalize to the nearest listing
function buildCanonical(opts: { company?: string }) {
  if (opts.company && opts.company !== DEFAULT_COMPANY)
    return `/products?company=${opts.company}`;
  return "/products";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;

  const query = (getParam(sp.query) ?? "").trim();
  const hasSortParam = getParam(sp.sort) !== undefined;
  const company = getParam(sp.company) ?? "";

  // Search and sort variants are duplicates/filters — not indexable.
  const noIndex = query.length > 0 || hasSortParam;

  const canonical = buildCanonical({ company });
  const canonicalUrl = `${SITE_URL}${canonical}`;

  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
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
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      images: [`${SITE_URL}/og.jpg`],
    },
  };
}

// Product listings update periodically
export const revalidate = 21600; // 6 hours

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const rawPage = Number(getParam(sp.page) ?? "1");

  if (!Number.isInteger(rawPage) || rawPage < 1) {
    notFound();
  }

  const page = rawPage;
  const query = (getParam(sp.query) ?? "").trim();
  const sort = getParam(sp.sort) ?? DEFAULT_SORT;
  // Empty company = unfiltered listing (all active companies).
  const company = getParam(sp.company) ?? "";

  const [result, companies] = await Promise.all([
    getPublicProductsService({ page, query, sort, companySlug: company }),
    getActiveCompanies(),
  ]);
  const { products, total, totalPages } = result;
  const selectedCompany = companies.find((item) => item.slug === company);
  if (company && !selectedCompany) notFound();

  if (totalPages > 0 && page > totalPages) {
    notFound();
  }

  const renderedUrl = buildRenderedUrl({ page, query, sort, company });

  // Data for the company filter dropdown inside the search bar.
  const filterCompanies = companies.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
  }));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: selectedCompany
      ? `${selectedCompany.name} Product Catalog`
      : "Ayurvedic Product Catalog",
    description: selectedCompany
      ? `Catalog of Ayurvedic products offered by ${selectedCompany.name}.`
      : "Catalog of Ayurvedic products from all active Vedic Wellness companies.",
    url: `${SITE_URL}${renderedUrl}`,
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
        companies={filterCompanies}
      />

      <section className="w-full px-4 pb-10 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <ExpandableSeoContent
            title="Ayurvedic Products & PCD Pharma Franchise Range"
            preview="The Vedic Wellness product range covers Ayurvedic wellness formulations, product categories and PCD pharma franchise distribution across India."
          >
            <p>
              This section will expand on the Ayurvedic product range and the
              main product categories available through Vedic Wellness.
            </p>

            <p>
              This section will cover the GMP-backed manufacturing and quality
              context behind the formulations.
            </p>

            <p>
              This section will explain how the product range supports PCD
              pharma franchise and distributor partners.
            </p>

            <p>
              Learn more about the{" "}
              <SeoLink href="/about">Vedic Wellness PCD pharma franchise</SeoLink>,
              read our <SeoLink href="/blogs">Ayurveda insights on the blog</SeoLink>,
              or{" "}
              <SeoLink href="/contact">contact our team for product and franchise enquiries</SeoLink>.
            </p>
          </ExpandableSeoContent>
        </div>
      </section>
    </>
  );
}