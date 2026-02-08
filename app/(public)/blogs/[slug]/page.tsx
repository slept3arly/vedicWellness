import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type Props = {
  params: Promise<{ slug: string }>;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

/* ------------------------------------------------------------------ */
/* Metadata */
/* ------------------------------------------------------------------ */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const blog = await prisma.blog.findFirst({
    where: { slug, published: true },
    select: { title: true, description: true, thumbnailUrl: true },
  });

  if (!blog) return {};

  return {
    title: `${blog.title} | Vedic Wellness Blogs`,
    description:
      blog.description ??
      "Read the latest Ayurveda insights and franchise updates from Vedic Wellness.",
    alternates: { canonical: `/blogs/${slug}` },

    openGraph: {
      title: blog.title,
      description: blog.description ?? "",
      url: `${SITE_URL}/blogs/${slug}`,
      images: blog.thumbnailUrl ? [{ url: blog.thumbnailUrl }] : undefined,
      type: "article",
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default async function BlogDetailsPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const blog = await prisma.blog.findFirst({
    where: { slug, published: true },
  });

  if (!blog) return notFound();

  const blogUrl = `${SITE_URL}/blogs/${blog.slug}`;
  const imageUrl = blog.thumbnailUrl ?? `${SITE_URL}/og.jpg`;

  /* ---------------- JSON-LD ---------------- */

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
    headline: blog.title,
    description: blog.description ?? "Read this article from Vedic Wellness.",
    image: [imageUrl],
    datePublished: new Date(blog.createdAt).toISOString(),
    dateModified: new Date(blog.updatedAt ?? blog.createdAt).toISOString(),
    inLanguage: "en-IN",
    author: {
      "@type": "Organization",
      name: "Vedic Wellness",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Vedic Wellness",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    isPartOf: {
      "@type": "Blog",
      name: "Vedic Wellness Blogs",
      url: `${SITE_URL}/blogs`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blogs", item: `${SITE_URL}/blogs` },
      { "@type": "ListItem", position: 3, name: blog.title, item: blogUrl },
    ],
  };

  return (
    <section>
      <div className="mx-auto max-w-5xl px-6 pt-10 pb-20 space-y-8">

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          <Chip>Blogs</Chip>
          <Chip>Ayurveda</Chip>
          <Chip>PCD Pharma</Chip>
        </div>

        {/* Cover Image */}
        {blog.thumbnailUrl && (
          <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={blog.thumbnailUrl}
              alt={blog.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 768px"
            />
          </div>
        )}

        {/* Content */}
        <Card className="bg-white/80 dark:bg-black/45">
          <article className="prose prose-neutral dark:prose-invert max-w-none">

            <h1 className="font-heading text-3xl md:text-4xl font-extrabold">
              {blog.title}
            </h1>

            {blog.description && (
              <p className="text-lg text-muted">
                {blog.description}
              </p>
            )}

            <div className="mt-4 text-sm text-muted">
              Published on{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            <div className="mt-8 whitespace-pre-wrap leading-7">
              {blog.content}
            </div>

          </article>
        </Card>
      </div>
    </section>
  );
}
