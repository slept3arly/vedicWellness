import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";
import { getPublicBlogsService } from "@/lib/services/blogService";

export const dynamic = "force-static";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
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
    blogPost: blogs.map((b) => ({
      "@type": "BlogPosting",
      headline: b.title,
      description: b.description ?? "Read this article from Vedic Wellness.",
      url: `${SITE_URL}/blogs/${b.slug}`,
      datePublished: new Date(b.createdAt).toISOString(),
      dateModified: new Date(b.updatedAt).toISOString(),
      image: b.thumbnailUrl ? [b.thumbnailUrl] : [`${SITE_URL}/og.jpg`],
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogsClient blogs={blogs} />
    </>
  );
}