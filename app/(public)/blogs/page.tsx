import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";
import { getPublicBlogsService } from "@/lib/services/blogService";

export const dynamic = "force-static";
export const revalidate = 600; // ✅ ISR cache (10 minutes)

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

export const metadata: Metadata = {
  title: "Blogs | Vedic Wellness - Ayurvedic PCD Pharma Franchise",
  description:
    "Read Ayurvedic healthcare insights, franchise updates and business knowledge by Vedic Wellness (Innovia Drugs).",
  alternates: { canonical: "/blogs" },
};

export default async function BlogsPage() {
  const blogs = await getPublicBlogsService();

  /* ========================================================= */
  /* SORT BLOGS — NEWEST FIRST                                 */
  /* ========================================================= */

  const sortedBlogs = [...blogs].sort((a, b) => {
    const aDate = new Date(a.publishedAt ?? a.createdAt).getTime();
    const bDate = new Date(b.publishedAt ?? b.createdAt).getTime();
    return bDate - aDate;
  });

  /* ========================================================= */
  /* ⭐ FEATURED BLOGS LOGIC (FIXED + DETERMINISTIC)           */
  /* ========================================================= */

  const FEATURED_COUNT = 3;

  // ⭐ ALWAYS newest 3 blogs
  const featuredBlogs = sortedBlogs.slice(0, FEATURED_COUNT);

  // ⭐ Rest go into latest articles section
  const newBlogs = sortedBlogs.slice(FEATURED_COUNT);

  /* ========================================================= */
  /* JSON-LD SEO STRUCTURED DATA                               */
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
    blogPost: blogs.map((b) => {
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
      />
    </>
  );
}