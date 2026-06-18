import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getPublicBlogBySlugService,
  getAllPublishedBlogSlugsService,
  getRelatedBlogsService,
} from "@/lib/services/public/blogService";

import SlugClient from "./SlugClient";

export const revalidate = 21600;

type Props = {
  params: Promise<{ slug: string }>;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

/* ------------------------------------------------------------------ */
/* Static Generation */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const blogs = await getAllPublishedBlogSlugsService();

  return blogs.map((b) => ({
    slug: b.slug,
  }));
}

/* ------------------------------------------------------------------ */
/* Metadata */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const blog = await getPublicBlogBySlugService(decodedSlug);

  if (!blog) return {};

  const imageUrl =
    blog.thumbnailUrl ??
    `${SITE_URL}/og.jpg`;

  const title =
    blog.metaTitle ??
    `${blog.title} | Vedic Wellness Blogs`;

  const description =
    blog.metaDescription ??
    blog.description ??
    "Read the latest Ayurveda insights from Vedic Wellness.";

  const canonical =
    blog.canonicalUrl ??
    `${SITE_URL}/blogs/${decodedSlug}`;

  return {
    title,
    description,
    keywords: blog.tags ?? [],
    

    alternates: {
      canonical,
    },

    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: [imageUrl],
      siteName: "Vedic Wellness",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const blog = await getPublicBlogBySlugService(decodedSlug);

  if (!blog) return notFound();

  const relatedBlogs = blog.tags?.length
    ? await getRelatedBlogsService(blog.slug, blog.tags)
    : [];

  const blogUrl = `${SITE_URL}/blogs/${blog.slug}`;
  const imageUrl = blog.thumbnailUrl ?? `${SITE_URL}/og.jpg`;

  const publishedDate = new Date(
    blog.publishedAt ?? blog.createdAt
  ).toISOString();

  /* ========================================================= */
  /* HEADINGS EXTRACTION */
  /* ========================================================= */

  const headings =
    blog.content
      ?.match(/^##\s(.+)$/gm)
      ?.map((h) => h.replace(/^##\s/, "")) ?? [];

  /* ========================================================= */
  /* JSON-LD */
  /* ========================================================= */

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
    headline: blog.metaTitle ?? blog.title,
    url: blogUrl,
    description: blog.metaDescription ?? blog.description ?? "",
    keywords: blog.tags?.join(", "),
    articleSection:
      blog.tags?.[0] ?? "Ayurveda",
    image: [imageUrl],
    datePublished: publishedDate,
    dateModified: new Date(
      blog.updatedAt ?? blog.createdAt
    ).toISOString(),
    author: {
      "@type": "Organization",
      name: blog.author ?? "Vedic Wellness",
    },
    publisher: {
      "@type": "Organization",
      name: "Vedic Wellness",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <SlugClient
        blog={blog}
        relatedBlogs={relatedBlogs}
        headings={headings}
      />
    </>
  );
}