import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";

type Props = {
  params: Promise<{ slug: string }>;
};

// ✅ dynamic meta tags per blog
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const blog = await prisma.blog.findFirst({
    where: { slug, published: true },
    select: { title: true, description: true },
  });

  if (!blog) return {};

  return {
    title: `${blog.title} | Vedic Wellness Blogs`,
    description:
      blog.description ??
      "Read the latest Ayurveda insights and franchise updates from Vedic Wellness.",
    alternates: { canonical: `/blogs/${slug}` },
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;

  const blog = await prisma.blog.findFirst({
    where: { slug, published: true },
  });

  if (!blog) return notFound();

  // ✅ schema for THIS blog post
  const baseUrl = "https://yourdomain.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description ?? "Read this article from Vedic Wellness.",
    datePublished: new Date(blog.createdAt).toISOString(),
    dateModified: new Date(blog.createdAt).toISOString(),
    mainEntityOfPage: `${baseUrl}/blogs/${blog.slug}`,
    author: {
      "@type": "Organization",
      name: "Vedic Wellness (Innovia Drugs)",
    },
    publisher: {
      "@type": "Organization",
      name: "Vedic Wellness (Innovia Drugs)",
    },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-5xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        {/* ✅ schema must be on page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Top chips */}
        <div className="flex flex-wrap gap-3">
          <Chip>Blogs</Chip>
          <Chip>Ayurveda</Chip>
          <Chip>PCD Pharma</Chip>
        </div>

        {/* ✅ Thumbnail (optional) */}
        {blog.thumbnailUrl ? (
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
            <img
              src={blog.thumbnailUrl}
              alt={blog.title}
              className="w-full max-h-[420px] object-cover"
            />
          </div>
        ) : null}

        <GlassCard className="mt-6 p-7 md:p-10">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            {blog.title}
          </h1>

          {blog.description ? (
            <p className="mt-4 font-body text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              {blog.description}
            </p>
          ) : null}

          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Published on {new Date(blog.createdAt).toLocaleDateString()}
          </div>

          <div className="mt-10 font-body text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-7">
            {blog.content}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
