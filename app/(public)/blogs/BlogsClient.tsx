"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

import PageHeader from "@/components/public/PageHeader";
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
}: {
  featuredBlogs: BlogListItem[];
  newBlogs: BlogListItem[];
}) {
  const renderDate = (b: BlogListItem) =>
    new Date(b.publishedAt ?? b.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">

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
              <span className="text-accent">Vedic Wellness</span>
            </>
          }
          subtitle="Read our latest articles, Ayurveda insights, company updates, and franchise business knowledge."
        />

        {/* KEYWORD CHIPS */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Ayurveda", "Franchise", "PCD Pharma", "Updates"].map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        {/* ⭐ FEATURED BLOGS */}
        {featuredBlogs.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-extrabold mb-6">
              Featured Blogs
            </h2>

            <motion.div
              variants={staggerSlow}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 lg:grid-cols-3"
            >
              {featuredBlogs.map((b) => (
                <motion.div key={b.id} variants={fadeUpSoft}>
                  <Link
                    href={`/blogs/${encodeURIComponent(b.slug)}`}
                    className="group block h-full"
                  >
                    <Card className="h-full">

                      {b.thumbnailUrl && (
                        <div className="relative mb-4 h-52 w-full overflow-hidden rounded-2xl">
                          <Image
                            src={b.thumbnailUrl}
                            alt={b.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading text-lg font-extrabold leading-snug">
                          {b.title}
                        </h3>

                        <ArrowUpRight
                          size={26}
                          strokeWidth={2.4}
                          className="
                            shrink-0 mt-1
                            text-muted
                            transition-all duration-300
                            group-hover:text-accent
                            group-hover:translate-x-[2px]
                            group-hover:-translate-y-[2px]
                          "
                        />
                      </div>

                      <p className="mt-3 text-sm text-muted line-clamp-3">
                        {b.description || "Read this article to learn more."}
                      </p>

                      <div className="mt-5 text-xs text-muted flex items-center gap-2">
                        <span>{b.author ?? "Vedic Wellness Team"}</span>
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

        {/* 🆕 NEW BLOGS */}
        <div className="mt-20">
          <h2 className="font-heading text-2xl font-extrabold mb-6">
            Latest Articles
          </h2>

          <motion.div
            variants={staggerSlow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {newBlogs.map((b) => (
              <motion.div key={b.id} variants={fadeUpSoft}>
                <Link
                  href={`/blogs/${encodeURIComponent(b.slug)}`}
                  className="group block h-full"
                >
                  <Card className="h-full">

                    {b.thumbnailUrl && (
                      <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl">
                        <Image
                          src={b.thumbnailUrl}
                          alt={b.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading text-lg font-extrabold leading-snug">
                        {b.title}
                      </h3>

                      <ArrowUpRight
                        size={24}
                        strokeWidth={2.3}
                        className="
                          shrink-0 mt-1
                          text-muted
                          transition-all duration-300
                          group-hover:text-accent
                          group-hover:translate-x-[2px]
                          group-hover:-translate-y-[2px]
                        "
                      />
                    </div>

                    <p className="mt-3 text-sm text-muted line-clamp-3">
                      {b.description || "Read this article to learn more."}
                    </p>

                    <div className="mt-5 text-xs text-muted flex items-center gap-2">
                      <span>{b.author ?? "Vedic Wellness Team"}</span>
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
                No blogs published yet.
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}