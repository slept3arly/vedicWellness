"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

import PageHeader from "@/components/public/PageHeader";
import GlassCard from "@/components/old_files/ui/GlassCard";
import Chip from "@/components/public/ui/Chip";

import {
  fadeUpSoft,
  staggerSlow,
} from "@/app/animations";

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
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">

        {/* HEADER */}
        <PageHeader
          badge={
            <span className="inline-flex items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Blogs & Updates
            </span>
          }
          title={
            <>
              Learn more with{" "}
              <span className="dark:text-green-400">Vedic Wellness</span>
            </>
          }
          subtitle="Read our latest articles, company updates, Ayurveda insights, and franchise business knowledge."
        />

        {/* CHIPS */}
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
            <motion.div
              key={b.id}
              variants={fadeUpSoft}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <Link
                href={`/blogs/${encodeURIComponent(b.slug)}`}
                className="block group"
              >
                <GlassCard className="p-6 transition-shadow hover:shadow-2xl">

                  {/* IMAGE */}
                  {b.thumbnailUrl && (
                    <div className="mb-4 relative h-44 w-full overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={b.thumbnailUrl}
                        alt={b.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.05]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}

                  {/* TITLE */}
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-heading text-lg font-extrabold text-slate-900 dark:text-white">
                      {b.title}
                    </h2>

                    <ArrowUpRight
                      size={18}
                      className="text-slate-400 group-hover:text-green-600 transition"
                    />
                  </div>

                  {/* DESC */}
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                    {b.description || "Read this article to learn more."}
                  </p>

                  {/* META */}
                  <div className="mt-5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    {new Date(b.createdAt).toLocaleDateString()}
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      Read →
                    </span>
                  </div>

                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* EMPTY STATE */}
        {blogs.length === 0 && (
          <div className="mt-10">
            <GlassCard className="p-8 text-center">
              No blogs published yet.
            </GlassCard>
          </div>
        )}

      </div>
    </section>
  );
}
