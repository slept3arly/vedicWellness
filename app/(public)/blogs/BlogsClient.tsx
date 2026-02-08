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
  createdAt: Date;
};

export default function BlogsClient({ blogs }: { blogs: BlogListItem[] }) {
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
              <span className="text-[color:var(--brand-accent)]">
                Vedic Wellness
              </span>
            </>
          }
          subtitle="Read our latest articles, Ayurveda insights, company updates, and franchise business knowledge."
        />

        {/* FILTER CHIPS */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Ayurveda", "Franchise", "PCD Pharma", "Updates"].map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        {/* BLOG GRID */}
        <motion.div
          variants={staggerSlow}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {blogs.map((b) => (
            <motion.div key={b.id} variants={fadeUpSoft}>
              <Link
                href={`/blogs/${encodeURIComponent(b.slug)}`}
                className="group block h-full"
              >
                <Card className="h-full bg-white/75 dark:bg-black/45">
                  {/* IMAGE */}
                  {b.thumbnailUrl && (
                    <div className="mb-4 relative h-44 w-full overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={b.thumbnailUrl}
                        alt={b.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}

                  {/* TITLE */}
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-heading text-lg font-extrabold">
                      {b.title}
                    </h2>

                    <ArrowUpRight
                      size={18}
                      className="text-muted transition group-hover:text-[color:var(--brand-accent)]"
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-3 text-sm text-muted line-clamp-3">
                    {b.description || "Read this article to learn more."}
                  </p>

                  {/* META */}
                  <div className="mt-5 flex items-center justify-between text-xs text-muted">
                    {new Date(b.createdAt).toLocaleDateString()}

                    <span className="font-semibold text-[color:var(--brand-accent)]">
                      Read →
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* EMPTY STATE */}
        {blogs.length === 0 && (
          <div className="mt-10 flex justify-center">
            <Card className="max-w-md text-center bg-white/75 dark:bg-black/45">
              No blogs published yet.
            </Card>
          </div>
        )}

      </div>
    </section>
  );
}
