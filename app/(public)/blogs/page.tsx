import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";
import { getPublicBlogsService } from "@/lib/services/public/blogService";
import { PUBLIC_BLOG_PAGE_SIZE } from "@/lib/constants";

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
  const page = Math.max(1, Number(sp?.page) || 1);

  const canonical =
    page > 1 ? `/blogs?page=${page}` : "/blogs";

  return {
    title:
      page > 1
        ? `Blogs - Page ${page} | Vedic Wellness`
        : "Blogs | Vedic Wellness - Ayurvedic PCD Pharma Franchise",
    description:
      "Read Ayurvedic healthcare insights, franchise updates and business knowledge by Vedic Wellness (Innovia Drugs).",
    alternates: {
      canonical,
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

  const page = Math.max(1, Number(getParam(sp.page)) || 1);

  const FEATURED_COUNT = 3;
  const PAGE_SIZE = PUBLIC_BLOG_PAGE_SIZE;

  const blogs = await getPublicBlogsService();

  /* ========================================================= */
  /* FEATURED BLOGS */
  /* ========================================================= */

  const featuredBlogs = blogs.slice(0, FEATURED_COUNT);

  /* ========================================================= */
  /* PAGINATED BLOGS */
  /* ========================================================= */

  const remainingBlogs = blogs.slice(FEATURED_COUNT);

  const totalPages = Math.ceil(remainingBlogs.length / PAGE_SIZE);

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const newBlogs = remainingBlogs.slice(start, end);

  /* ========================================================= */
  /* JSON-LD */
  /* ========================================================= */

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
    blogPost: newBlogs.map((b) => {
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