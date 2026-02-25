"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "app/animations";

import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";

type Blog = any;

export default function SlugClient({
  blog,
  relatedBlogs,
  headings,
}: {
  blog: Blog;
  relatedBlogs: any[];
  headings: string[];
}) {
  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

  const contentRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date(
    blog.publishedAt ?? blog.createdAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* ⭐ Smooth Scroll */
  const handleScrollTo = (h: string) => {
    const container = contentRef.current;
    const el = document.getElementById(slugify(h));
    if (!container || !el) return;

    container.scrollTo({
      top: el.offsetTop - 24,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-10 lg:px-16 space-y-6">

        {/* ⭐ HERO */}
        <Card className="mt-4 md:mt-8 overflow-hidden p-0">
          <div className="flex flex-col lg:flex-row items-stretch">
            {blog.thumbnailUrl && (
              <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-auto min-h-[250px] md:min-h-[350px]">
                <Image
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 text-[10px] text-muted uppercase tracking-widest mb-4">
                <span className="text-[var(--brand-primary)] font-bold">
                  {blog.category || "Wellness"}
                </span>
                <span>•</span>
                <span>
                  {Math.ceil((blog.content?.length ?? 0) / 800)} min read
                </span>
              </div>

              <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-6">
                {blog.title}
              </h1>

              <div className="flex items-center gap-4 pt-5 border-t border-[var(--border-soft)] mt-auto">
                <div className="space-y-1">
                  <p className="text-xs font-semibold">
                    By {blog.author ?? "Vedic Wellness Team"}
                  </p>
                  <p className="text-[10px] text-muted tracking-wider uppercase">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ⭐ MAIN */}
        <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-8 items-start">

          {/* ⭐ TOC SIDEBAR */}
          <aside className="hidden lg:block sticky top-40 self-start">
            <Card className="px-6 py-5 !rounded-2xl">
              <h3
                className="
                text-xs
                font-semibold
                uppercase
                tracking-widest
                border-b border-[var(--border-soft)]
                pb-3
                mb-4
              "
              >
                On this page
              </h3>

              <nav className="flex flex-col gap-3">
                {headings.map((h) => (
                  <button
                    key={h}
                    onClick={() => handleScrollTo(h)}
                    className="
                      text-left
                      text-[11px]
                      leading-relaxed
                      text-muted
                      transition-colors
                      hover:text-[var(--brand-primary)]
                    "
                  >
                    {h}
                  </button>
                ))}
              </nav>
            </Card>
          </aside>

          {/* ⭐ ARTICLE */}
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card
              ref={contentRef}
              className="p-6 md:p-12 overflow-y-auto h-[60vh] scroll-smooth custom-scrollbar"
            >
              <article
                className="
                  prose max-w-none
                  prose-headings:border-none prose-headings:my-0
                  prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mb-8 prose-h2:mt-2
                  prose-p:text-muted prose-p:leading-8 prose-p:text-[16px]
                  prose-ul:list-disc prose-ul:pl-5 prose-ul:my-6
                  prose-li:text-muted prose-li:marker:text-[var(--brand-primary)]
                "
              >
                <ReactMarkdown
                  components={{
                    h2({ children }) {
                      const text = String(children);
                      return (
                        <div className="mt-12 first:mt-0 mb-8">
                          <h2
                            id={slugify(text)}
                            className="flex items-center gap-4"
                          >
                            <span className="h-8 w-1.5 bg-[var(--brand-primary)] rounded-full" />
                            <span className="text-[1.2em] font-bold leading-tight">
                              {children}
                            </span>
                          </h2>
                        </div>
                      );
                    },
                    hr: () => null,
                  }}
                >
                  {blog.content ?? ""}
                </ReactMarkdown>
              </article>

              {blog.tags?.length > 0 && (
                <div className="mt-16 pt-8 border-t border-[var(--border-soft)] flex flex-wrap gap-2">
                  {blog.tags.map((tag: string) => (
                    <Chip
                      key={tag}
                      className="opacity-60 text-[10px] hover:opacity-100"
                    >
                      #{tag}
                    </Chip>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* ⭐ RELATED */}
        {relatedBlogs.length > 0 && (
          <div className="pt-8 space-y-6">
            <h2 className="font-heading text-2xl font-bold">
              Related Reading
            </h2>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {relatedBlogs.slice(0, 4).map((r) => (
                <Link key={r.id} href={`/blogs/${r.slug}`} className="block">
                  <Card className="overflow-hidden p-0">
                    {r.thumbnailUrl && (
                      <div className="relative aspect-video w-full max-h-[160px]">
                        <Image
                          src={r.thumbnailUrl}
                          alt={r.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="p-5 space-y-2">
                      <h3 className="font-heading font-bold text-lg line-clamp-1">
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