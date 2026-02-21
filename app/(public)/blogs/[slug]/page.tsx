import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";

import {
  getPublicBlogBySlugService,
  getPublicBlogMetadataService,
  getAllPublishedBlogSlugsService,
} from "@/lib/services/blogService";

export const dynamicParams = true;

type Props = {
  params: { slug: string };
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
  const slug = decodeURIComponent(params.slug);

  const blog = await getPublicBlogMetadataService(slug);

  if (!blog) return {};

  return {
    title: `${blog.title} | Vedic Wellness Blogs`,
    description:
      blog.description ??
      "Read the latest Ayurveda insights and franchise updates from Vedic Wellness.",
    alternates: { canonical: `/blogs/${slug}` },
  };
}

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default async function BlogDetailsPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug);

  const blog = await getPublicBlogBySlugService(slug);

  if (!blog) return notFound();

  const blogUrl = `${SITE_URL}/blogs/${blog.slug}`;
  const imageUrl = blog.thumbnailUrl ?? `${SITE_URL}/og.jpg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
    headline: blog.title,
    description: blog.description ?? "",
    image: [imageUrl],
    datePublished: new Date(blog.createdAt).toISOString(),
    dateModified: new Date(blog.updatedAt ?? blog.createdAt).toISOString(),
  };

  return (
    <section>
      <div className="mx-auto max-w-5xl px-6 pt-10 pb-20 space-y-8">

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="flex flex-wrap gap-2">
          <Chip>Blogs</Chip>
          <Chip>Ayurveda</Chip>
          <Chip>PCD Pharma</Chip>
        </div>

        {blog.thumbnailUrl && (
          <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={blog.thumbnailUrl}
              alt={blog.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

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
              {new Date(blog.createdAt).toLocaleDateString("en-IN")}
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