"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";

import { fadeUpSoft, staggerSlow } from "@/app/animations";

type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  author?: string | null;
  createdAt: Date;
  publishedAt?: Date | null;
};

export default function BlogsClient({
  featuredBlogs,
  newBlogs,
  page,
  totalPages,
}: {
  featuredBlogs: BlogListItem[];
  newBlogs: BlogListItem[];
  page: number;
  totalPages: number;
}) {
  const renderDate = (b: BlogListItem) =>
    new Date(b.publishedAt ?? b.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  /* ========================================================= */
  /* PAGINATION WINDOW (MATCHES PRODUCTS LOGIC)                */
  /* ========================================================= */

  const windowSize = 2;
  const start = Math.max(1, page - windowSize);
  const end = Math.min(totalPages, page + windowSize);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-20 space-y-10">
        {/* HEADER */}
        <PageHeader
          badge={
            <Chip className="flex items-center gap-2">
              <Sparkles size={14} />
              Blogs & Updates
            </Chip>
          }
          title={
            <>
              Learn more with{" "}
              <span className="text-brand-accent">Vedic Wellness</span>
            </>
          }
          subtitle="Read our latest articles, Ayurveda insights, company updates, and franchise business knowledge."
        />

        {/* KEYWORD CHIPS */}
        <div className="flex flex-wrap justify-center gap-3">
          {["Ayurveda", "Franchise", "PCD Pharma", "Updates"].map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        {/* ⭐ FEATURED BLOGS */}
        {featuredBlogs.length > 0 && (
          <div className="mt-10">
            <SectionHeading title="Featured Blogs" className="mb-6" />

            <motion.div
              variants={staggerSlow}
              initial="hidden"
              animate="show"
              className="grid gap-6 lg:grid-cols-3"
            >
              {featuredBlogs.map((b) => (
                <motion.div key={b.id} variants={fadeUpSoft} className="group">
                  <Link
                    href={`/blogs/${encodeURIComponent(b.slug)}`}
                    prefetch={false}
                    className="block h-full"
                  >
                    <Card className="h-full">
                      {b.thumbnailUrl && (
                        <div className="relative mb-4 h-52 w-full overflow-hidden rounded-2xl">
                          <Image
                            src={b.thumbnailUrl}
                            alt={b.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading text-lg leading-snug">
                          {b.title}
                        </h3>

                        <ArrowUpRight
                          size={26}
                          strokeWidth={2.4}
                          className="shrink-0 mt-1 text-muted transition-all duration-300 group-hover:text-brand-accent group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                        />
                      </div>

                      <p className="mt-3 text-sm text-muted line-clamp-3">
                        {b.description || "Read this article to learn more."}
                      </p>

                      <div className="mt-5 text-xs text-muted flex items-center gap-2">
                        <span className="font-accent">
                          {b.author ?? "Vedic Wellness Team"}
                        </span>
                        <span>•</span>
                        <time>{renderDate(b)}</time>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* 🆕 LATEST BLOGS */}
        <div className="mt-16">
          <SectionHeading title="Latest Articles" className="mb-6" />

          <motion.div
            key={`blogs-page-${page}`}
            variants={staggerSlow}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {newBlogs.map((b) => (
              <motion.div key={b.id} variants={fadeUpSoft} className="group">
                <Link
                  href={`/blogs/${encodeURIComponent(b.slug)}`}
                  prefetch={false}
                  className="block h-full"
                >
                  <Card className="h-full">
                    {b.thumbnailUrl && (
                      <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl">
                        <Image
                          src={b.thumbnailUrl}
                          alt={b.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading text-lg leading-snug">
                        {b.title}
                      </h3>

                      <ArrowUpRight
                        size={24}
                        strokeWidth={2.3}
                        className="shrink-0 mt-1 text-muted transition-all duration-300 group-hover:text-brand-accent group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                      />
                    </div>

                    <p className="mt-3 text-sm text-muted line-clamp-3">
                      {b.description || "Read this article to learn more."}
                    </p>

                    <div className="mt-5 text-xs text-muted flex items-center gap-2">
                      <span className="font-accent">
                        {b.author ?? "Vedic Wellness Team"}
                      </span>
                      <span>•</span>
                      <time>{renderDate(b)}</time>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {newBlogs.length === 0 && (
            <div className="mt-10 flex justify-center">
              <Card className="max-w-md text-center">
                <p>No blogs published yet.</p>
              </Card>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-[11px] text-muted uppercase tracking-widest font-heading">
              Page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              {pages.map((p) => (
                <Link
                  key={p}
                  href={`/blogs?page=${p}`}
                  prefetch={false}
                  className={`w-16 h-10 rounded-lg flex items-center justify-center text-sm font-heading transition-all ${
                    p === page
                      ? "bg-surface border border-white/50 shadow-lg shadow-brand-accent/20 scale-110"
                      : "bg-surface border border-border-soft hover:border-brand-accent/50"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}