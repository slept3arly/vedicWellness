"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Chip from "@/components/ui/Chip";

type Blog = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  thumbnailUrl: string | null; // ✅ add this
  published: boolean;
  createdAt: Date;
};


export default function BlogsClient({ blogs }: { blogs: Blog[] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        <PageHeader
          badge={
            <p className="inline-flex mx-auto items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Blogs & Updates
            </p>
          }
          title={
            <>
              Learn more with{" "}
              <span className="text-w dark:text-green-400">Vedic Wellness</span>
            </>
          }
          subtitle="Read our latest articles, company updates, Ayurveda insights, and franchise business knowledge."
        />

        {/* Chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Ayurveda", "Franchise", "PCD Pharma", "Updates"].map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading
            title="Latest Articles"
            subtitle="Fresh reads from our team"
          />

          {/* Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b, idx) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
              >
                <Link href={`/blogs/${encodeURIComponent(b.slug)}`} className="block group">
                  <GlassCard className="p-6 transition hover:shadow-2xl">
                    {b.thumbnailUrl ? (
                      <div className="mb-4 overflow-hidden rounded-2xl border border-white/10">
                        <img
                        src={b.thumbnailUrl}
                        alt={b.title}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                      />
                      </div>
                    ) : null}
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="font-heading text-lg font-extrabold text-slate-900 dark:text-white">
                        {b.title}
                      </h2>

                      <span className="text-slate-500 dark:text-slate-300 transition group-hover:text-green-600">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>

                    <p className="mt-3 font-body text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                      {b.description || "Read this article to learn more."}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>

                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                        Read →
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Empty */}
          {blogs.length === 0 ? (
            <div className="mt-10">
              <GlassCard className="p-8 text-center">
                <p className="font-body text-slate-700 dark:text-slate-300">
                  No blogs published yet.
                </p>
              </GlassCard>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
