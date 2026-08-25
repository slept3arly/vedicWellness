import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";
import { getPublicBlogsService } from "@/lib/services/public/blogService";
import { notFound } from "next/navigation";

/* ========================================================= */
/* CONSTANTS */
/* ========================================================= */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

/* ========================================================= */
/* METADATA */
/* ========================================================= */

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const rawPage = Number(sp?.page ?? "1");
  const page =
    Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const canonical =
    page > 1 ? `/blogs?page=${page}` : "/blogs";

  const title =
    page > 1
      ? `Blogs - Page ${page} | Vedic Wellness`
      : "Blogs | Vedic Wellness - Ayurvedic PCD Pharma Franchise";
  const description =
    "Read Ayurvedic healthcare insights, franchise updates and business knowledge by Vedic Wellness (Innovia Drugs).";

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonical}`,
      title,
      description,
      siteName: "Vedic Wellness",
      images: [
        {
          url: `${SITE_URL}/og.jpg`,
          width: 1200,
          height: 630,
          alt: "Vedic Wellness Blogs",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og.jpg`],
    },
  };
}

/* ========================================================= */
/* PAGE */
/* ========================================================= */

type SearchParams = {
  page?: string;
};

export default async function BlogsPage({
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

  const { featuredBlogs, data: newBlogs, totalPages } =
    await getPublicBlogsService(page);

  /* ========================================================= */
  /* FEATURED BLOGS */
  /* ========================================================= */

  if (totalPages > 0 && page > totalPages) {
    notFound();
  }

  /* ========================================================= */
  /* JSON-LD */
  /* ========================================================= */

  // The structured data must mirror the visible listing, which shows the
  // featured posts plus the paginated list. newBlogs already excludes the
  // featured posts via its offset, but filter defensively by id so a post
  // can never appear twice.
  const listedBlogs = [
    ...featuredBlogs,
    ...newBlogs.filter((b) => !featuredBlogs.some((f) => f.id === b.id)),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blogs`,
    name: "Vedic Wellness Blogs",
    url: `${SITE_URL}/blogs`,
    publisher: {
      "@type": "Organization",
      name: "Vedic Wellness",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    blogPost: listedBlogs.map((b) => {
      const publishedDate = new Date(
        b.publishedAt ?? b.createdAt
      ).toISOString();

      const modifiedDate = new Date(
        b.updatedAt ?? b.createdAt
      ).toISOString();

      return {
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blogs/${b.slug}`,
        headline: b.title,
        description:
          b.description ?? "Read this article from Vedic Wellness.",
        url: `${SITE_URL}/blogs/${b.slug}`,
        datePublished: publishedDate,
        dateModified: modifiedDate,
        image: b.thumbnailUrl
          ? [b.thumbnailUrl]
          : [`${SITE_URL}/og.jpg`],
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogsClient
        featuredBlogs={featuredBlogs}
        newBlogs={newBlogs}
        page={page}
        totalPages={totalPages}
      />
    </>
  );
}
