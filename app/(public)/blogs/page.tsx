import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";
import { prisma } from "@/lib/db/prisma";

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
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Vedic Wellness Blogs",
    url: `${SITE_URL}/blogs`,
    blogPost: blogs.map((b) => ({
      "@type": "BlogPosting",
      headline: b.title,
      description: b.description ?? "Read this article from Vedic Wellness.",
      datePublished: new Date(b.createdAt).toISOString(),
      dateModified: b.updatedAt ? new Date(b.updatedAt).toISOString() : undefined,
      url: `${SITE_URL}/blogs/${b.slug}`,
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
