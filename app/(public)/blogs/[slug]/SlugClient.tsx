"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "app/animations";

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
  updatedAt?: string | Date;
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
}){
  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

  const contentRef = useRef<HTMLDivElement>(null);
  const tags = blog.tags ?? [];
  const formattedDate = new Date(
    blog.publishedAt ?? blog.createdAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
      <div className="mx-auto max-w-7xl px-6 space-y-6">

        {/* ⭐ HERO */}
        <Card className="mt-4 md:mt-8 overflow-hidden p-0">
          <div className="flex flex-col lg:flex-row items-stretch">
            {blog.thumbnailUrl && (
              <div className="relative w-full lg:w-1/2 aspect-[4/3] lg:aspect-[16/9] min-h-[250px] md:min-h-[350px]">
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
              <div className="flex flex-wrap gap-2 text-[10px] text-muted uppercase tracking-widest mb-4 font-heading">
                <span className="text-primary">
                  {blog.category || "Wellness"}
                </span>
                <span>•</span>
                <span>
                  {Math.ceil((blog.content?.length ?? 0) / 800)} min read
                </span>
              </div>

              <PageHeader 
                title={blog.title} 
                className="mb-6 !p-0 !text-left" 
              />

              <div className="flex items-center gap-4 pt-5 border-t border-border-soft mt-auto">
                <div className="space-y-1">
                  <p className="text-xs font-accent text-slate-600 dark:text-slate-300">
                    By {blog.author ?? "Vedic Wellness Team"}
                  </p>
                  <p className="text-[10px] text-muted tracking-wider uppercase text-slate-600 dark:text-slate-300 font-heading">
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
              <h3 className="font-heading text-xs uppercase tracking-widest border-b border-border-soft pb-3 mb-4">
                On this page
              </h3>

              <nav className="flex flex-col gap-3">
                {headings.map((h) => (
                  <button
                    key={h}
                    onClick={() => handleScrollTo(h)}
                    className="text-left text-[11px] leading-relaxed text-muted transition-colors hover:text-primary font-heading"
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
                  prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-8 prose-p:text-[16px]
                  prose-ul:list-disc prose-ul:pl-5 prose-ul:my-6
                  prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-li:marker:text-primary
                "
              >
                <ReactMarkdown
                  components={{
                    h2({ children }) {
                      const text = String(children);
                      return (
                        <div 
                          id={slugify(text)} 
                          className="mt-12 first:mt-0 mb-8 flex items-center gap-4 scroll-mt-6"
                        >
                          <span className="h-8 w-1.5 bg-primary rounded-full" />
                          <SectionHeading 
                            title={text} 
                            className="!mb-0" 
                          />
                        </div>
                      );
                    },
                    h3({ children }) {
                      return <h3 className="font-heading text-xl mt-8 mb-4">{children}</h3>;
                    },
                    hr: () => null,
                  }}
                >
                  {blog.content ?? ""}
                </ReactMarkdown>
              </article>

              {tags.length > 0 && (
                <div className="mt-16 pt-8 border-t border-border-soft flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Chip key={tag} className="opacity-60 text-[10px] hover:opacity-100 font-accent">
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
            <SectionHeading title="Related Reading" />

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {relatedBlogs.slice(0, 4).map((r) => (
                <Link key={r.id} href={`/blogs/${r.slug}`} className="block">
                  <Card className="overflow-hidden p-0">
                    {r.thumbnailUrl && (
                      <div className="relative aspect-[4/3] lg:aspect-[16/9] w-full max-h-[160px]">
                        <Image
                          src={r.thumbnailUrl}
                          alt={r.title}
                          fill className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                          />
                      </div>
                    )}
                    <div className="p-5 space-y-2">
                      <h3 className="font-heading text-xl line-clamp-1">{r.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{r.description}</p>
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