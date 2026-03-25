"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Search,
  Trash2,
  Pencil,
  Calendar,
  User,
  Tag,
  Eye,
  EyeOff,
  Image as ImageIcon,
  X,
  Plus,
  ArrowUpDown,
  FileText,
} from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminButton from "../../../../components/admin/AdminButton";
import AdminBadge from "../../../../components/admin/AdminBadge";
import PageHeader from "@/components/public/ui/PageHeader";

import { deleteBlog, toggleBlogPublished } from "./serverActions";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

/* ------------------------------------------------------------------ */

type Blog = {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  published: boolean;
  createdAt: Date;
  publishedAt: Date | null;

  // optional (UI-safe)
  excerpt?: string | null;
};

/* ------------------------------------------------------------------ */

function formatDate(d?: string | Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

/* ------------------------------------------------------------------ */

export default function AdminBlogsClient({
  blogs,
  total,
  page,
  q,
}: {
  blogs: Blog[];
  total: number;
  page: number;
  q: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(q);

  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const query = (fd.get("query") as string).trim();
    const p = new URLSearchParams();
    p.set("page", "1");
    if (query) p.set("q", query);
    startTransition(() => router.push(`?${p.toString()}`));
  }

  const handleClear = () => {
    setInputValue("");
    startTransition(() => router.push("?page=1"));
  };

  function updatePage(newPage: number) {
    const p = new URLSearchParams();
    p.set("page", String(newPage));
    if (q) p.set("q", q);
    startTransition(() => router.replace(`?${p.toString()}`));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <PageHeader title="Blogs" subtitle="Manage your blog posts" />
        <Link href="/admin/blogs/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            New Post
          </AdminButton>
        </Link>
      </div>

      {/* ── Search ── */}
      <AdminCard className="p-3">
        <form onSubmit={handleFilter} className="flex flex-col gap-2">

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              name="query"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by title, author, category..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm focus:ring-2 focus:ring-black outline-none"
            />
            {(inputValue || q) && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 h-10">
              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <select
                name="sort"
                defaultValue="newest"
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
                className="bg-transparent w-full text-sm outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title_asc">Title A→Z</option>
                <option value="title_desc">Title Z→A</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-5 rounded-lg bg-black text-white text-sm font-medium hover:opacity-80 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>
          </div>
        </form>

        <div className="mt-2 text-xs text-neutral-400 flex justify-between px-0.5">
          <span>
            {total} result{total !== 1 ? "s" : ""}
            {q && <> for "<span className="font-medium">{q}</span>"</>}
          </span>
          <span>
            Page {page} / {totalPages}
          </span>
        </div>
      </AdminCard>

      {/* ── List ── */}
      <div className={`space-y-3 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        {blogs.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <Search className="h-8 w-8 text-neutral-300" />
            <p className="font-semibold text-neutral-500">No blogs found</p>
            <button
              onClick={handleClear}
              className="text-sm text-neutral-400 underline"
            >
              Clear search
            </button>
          </AdminCard>
        ) : (
          blogs.map((b, index) => (
            <AdminCard
              key={b.id}
              className="flex flex-col sm:flex-row gap-4 hover:shadow-md"
            >
              {/* LEFT */}
              <div className="flex sm:flex-col items-center gap-3 shrink-0">
                <span className="text-xs text-neutral-400 w-5 text-center">
                  {(page - 1) * ADMIN_PAGE_SIZE + index + 1}
                </span>

                <div className="w-16 h-16 rounded-xl bg-neutral-100 flex items-center justify-center overflow-hidden border">
                  {b.thumbnailUrl ? (
                    <Image src={b.thumbnailUrl} alt={b.title} width={64} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-neutral-400" />
                  )}
                </div>
              </div>

              {/* MIDDLE */}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-xl font-semibold">{b.title}</h3>
                    <AdminBadge status={b.published ? "ACTIVE" : "INACTIVE"} />
                  </div>

                  {b.excerpt && (
                    <p className="text-xs line-clamp-1">{b.excerpt}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                  <Meta label="Author"><User className="h-3.5 w-3.5" />{b.author || "—"}</Meta>
                  <Meta label="Category"><Tag className="h-3.5 w-3.5" />{b.category || "—"}</Meta>
                  <Meta label="Slug"><FileText className="h-3.5 w-3.5" />{b.slug}</Meta>
                  <Meta label="Published"><Calendar className="h-3.5 w-3.5" />{formatDate(b.createdAt)}</Meta>
                </div>
              </div>

              {/* RIGHT */}
              <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2">
                <AdminButton onClick={() => startTransition(() => router.push(`/admin/blogs/edit/${b.id}`))}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </AdminButton>

                <form action={toggleBlogPublished}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="published" value={String(b.published)} />
                  <AdminActionButton>
                    {b.published ? <><EyeOff /> Unpublish</> : <><Eye /> Publish</>}
                  </AdminActionButton>
                </form>

                <form action={deleteBlog}>
                  <input type="hidden" name="id" value={b.id} />
                  <AdminActionButton variant="danger">
                    <Trash2 /> Delete
                  </AdminActionButton>
                </form>
              </div>

            </AdminCard>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between pt-2">
        <button disabled={page === 1} onClick={() => updatePage(page - 1)}>
          ← Previous
        </button>

        <button disabled={page === totalPages} onClick={() => updatePage(page + 1)}>
          Next →
        </button>
      </div>

    </div>
  );
}

/* ------------------------------------------------------------------ */

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium mb-0.5">
        {label}
      </div>
      <div className="flex items-center gap-1 text-sm">
        {children}
      </div>
    </div>
  );
}