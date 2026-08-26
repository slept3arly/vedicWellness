"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import type { ImgHTMLAttributes } from "react";

import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";

type Blog = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  thumbnailUrl?: string | null;
  author?: string | null;
  category?: string | null;
  tags?: string[];
  createdAt: string | Date;
  publishedAt?: string | Date | null;
};

type RelatedBlog = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  thumbnailUrl?: string | null;
};

export default function SlugClient({
  blog,
  relatedBlogs,
  headings,
}: {
  blog: Blog;
  relatedBlogs: RelatedBlog[];
  headings: string[];
}) {
  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

  const formattedDate = new Date(
    blog.publishedAt ?? blog.createdAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="w-full pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">

        {/* ================= HERO (MATCH PRODUCT STYLE) ================= */}
        <Card className="mt-6 md:mt-10 overflow-hidden p-0">
          <div className="flex flex-col lg:flex-row">

            {blog.thumbnailUrl && (
              <div className="relative w-full lg:w-1/2 aspect-[16/10] min-h-[260px]">
                <Image
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  fill
                  priority
                  placeholder="empty"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}

            <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-center">

              {/* META */}
              <div className="flex gap-2 text-[10px] uppercase tracking-widest text-muted mb-3">
                <span className="text-[color:var(--brand-primary)]">
                  {blog.category || "Wellness"}
                </span>
                <span>•</span>
                <span>
                  {Math.ceil((blog.content?.length ?? 0) / 800)} min read
                </span>
              </div>

              {/* TITLE */}
              <PageHeader
                title={blog.title}
                className="!p-0 !text-left mb-4"
              />

              {/* AUTHOR */}
              <div className="pt-4 border-t border-[var(--border-soft)] mt-4">
                <p className="text-xs text-muted">
                  By {blog.author ?? "Vedic Wellness Team"}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ================= MAIN ================= */}
        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">

            {/* ================= TOC ================= */}
            <aside className="hidden lg:block sticky top-48 self-start">
              <div className="surface rounded-xl p-5 space-y-4 text-xs">

                <p className="text-xs uppercase tracking-widest text-muted border-b border-[var(--border-soft)] pb-3">
                  On this page
                </p>

                {headings.map((h) => (
                  <a
                    key={h}
                    href={`#${slugify(h)}`}
                    className="
                      group relative block w-fit text-left
                      text-neutral-500 dark:text-neutral-400
                      hover:text-neutral-900 dark:hover:text-white
                      transition-colors duration-300
                      font-medium pb-1
                    "
                  >
                    {h}

                    {/* EXACT UNDERLINE (WORKING) */}
                    <span className="
                      absolute left-0 bottom-0 h-[1.5px] w-0
                      bg-neutral-900 dark:bg-white
                      transition-all duration-300
                      group-hover:w-full
                    " />
                  </a>
                ))}

              </div>
            </aside>

          {/* ================= CONTENT ================= */}
          <div>
            <Card className="p-6 md:p-10">
              <article
                className="
                  prose max-w-none
                  prose-headings:my-0
                  prose-p:text-muted prose-p:leading-7 prose-p:text-[15px]
                  prose-ul:pl-5 prose-ul:my-5
                  prose-li:leading-6 prose-li:marker:text-[color:var(--brand-primary)]
                "
              >
                <ReactMarkdown
                  components={{
                    // Article-body images come from arbitrary R2/remote URLs with
                    // unknown dimensions, so they render as plain <img> with lazy
                    // loading instead of next/image. Author-specified dimensions
                    // are preserved to avoid layout shift.
                    img({
                      src,
                      alt,
                      width,
                      height,
                    }: ImgHTMLAttributes<HTMLImageElement> & { node?: unknown }) {
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={typeof src === "string" ? src : undefined}
                          alt={alt ?? ""}
                          width={width}
                          height={height}
                          loading="lazy"
                          decoding="async"
                        />
                      );
                    },

                    h2({ children }) {
                      const text = String(children);
                      return (
                        <div
                          id={slugify(text)}
                          className="mt-12 first:mt-0 mb-6 flex items-center gap-3 scroll-mt-32"
                        >
                          <span className="h-6 w-1 bg-[color:var(--brand-primary)] rounded-full" />
                          <h2 className="font-heading text-xl">
                            {text}
                          </h2>
                        </div>
                      );
                    },

                    h3({ children }) {
                      return (
                        <h3 className="font-heading text-lg mt-6 mb-2">
                          {children}
                        </h3>
                      );
                    },

                    ul({ children }) {
                      return (
                        <ul className="space-y-2 list-disc pl-5">
                          {children}
                        </ul>
                      );
                    },

                    hr: () => null,
                  }}
                >
                  {blog.content ?? ""}
                </ReactMarkdown>
              </article>

              {/* TAGS */}
              {blog.tags?.length ? (
  <div className="mt-12 pt-6 border-t border-[var(--border-soft)] flex flex-wrap gap-2">
    {blog.tags.map((tag) => (
      <Chip key={tag} className="text-[10px] opacity-70 hover:opacity-100">
        #{tag}
      </Chip>
    ))}
  </div>
) : null}
            </Card>
          </div>
        </div>

        {/* ================= RELATED ================= */}
        {relatedBlogs.length > 0 && (
          <div className="pt-6 space-y-6">
            <SectionHeading title="Related Reading" />

            <div className="grid gap-6 sm:grid-cols-2">
              {relatedBlogs.slice(0, 4).map((r) => (
                <Link key={r.id} href={`/blogs/${encodeURIComponent(r.slug)}`}>
                  <Card className="overflow-hidden p-0">
                    {r.thumbnailUrl && (
                      <div className="relative aspect-[4/3] lg:aspect-[16/9] w-full max-h-[160px]">
                        <Image
                          src={r.thumbnailUrl}
                          alt={r.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                    )}

                    <div className="p-4 space-y-1">
                      <h3 className="font-heading text-lg line-clamp-1">
                        {r.title}
                      </h3>
                      <p className="text-xs text-muted line-clamp-2">
                        {r.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}