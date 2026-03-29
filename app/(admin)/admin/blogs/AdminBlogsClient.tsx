"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/* ICONS */
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
  FileText,
  RefreshCw,
  Hash,
} from "lucide-react";

/* COMPONENTS */
import AdminCard from "@/components/admin/AdminCard";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminButton from "@/components/admin/AdminButton";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPagination from "@/components/admin/AdminPagination";
import PageHeader from "@/components/public/ui/PageHeader";

/* UTILS */
import { cn } from "@/lib/cn";
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
  excerpt?: string | null;
};

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
  blogs = [],
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

  const handleSync = () => startTransition(() => router.refresh());

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const query = inputValue ? `&q=${encodeURIComponent(inputValue)}` : "";
      router.push(`/admin/blogs?page=${newPage}${query}`);
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-12">
      {/* 1. GLOBAL HEADER SYSTEM */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
        <PageHeader
          title="Blog Posts"
          subtitle={`Manage articles and news (${total})`}
          align="left"
          className="max-w-none m-0 p-0"
        />

        <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <AdminPagination
              page={page}
              totalPages={totalPages}
              isPending={isPending}
              onPageChange={handlePageChange}
            />
            <AdminButton
              onClick={handleSync}
              disabled={isPending}
              icon={({ className }) => (
                <RefreshCw className={cn(className, isPending && "animate-spin")} />
              )}
            >
              Sync
            </AdminButton>
          </div>
          <Link href="/admin/blogs/new" className="w-full lg:w-auto">
            <AdminButton variant="primary" icon={Plus} className="w-full sm:min-w-[215px]">
              New Blog
            </AdminButton>
          </Link>
        </div>
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />

      {/* 2. SEARCH SYSTEM */}
      <AdminCard compact className="!p-3 border-dashed bg-neutral-50/50 dark:bg-neutral-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by title, author, or category..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {inputValue && (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 cursor-pointer hover:text-red-500"
                onClick={() => {
                  setInputValue("");
                  router.push("/admin/blogs?page=1");
                }}
              />
            )}
          </div>
          <AdminButton type="submit" icon={Search}>
            Search
          </AdminButton>
        </form>
      </AdminCard>

      {/* 3. GLOBAL GRID SYSTEM (3-COLUMN LAYOUT) */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        {blogs.map((b, idx) => {
          const displayIndex = (page - 1) * ADMIN_PAGE_SIZE + (idx + 1);

          return (
            <AdminCard
              key={b.id}
              compact
              index={displayIndex}
              className="group flex flex-col h-full border-t-4 border-t-neutral-200 dark:border-t-neutral-700 hover:border-t-primary/50 transition-all"
            >
              {/* Status & Category */}
              <div className="flex justify-between items-start mb-3">
                <AdminBadge status={b.published ? "ACTIVE" : "INACTIVE"} />
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-neutral-400">
                  <Tag className="h-2.5 w-2.5" /> {b.category || "General"}
                </div>
              </div>

              {/* Thumbnail */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mb-4 shrink-0">
                {b.thumbnailUrl ? (
                  <Image
                    src={b.thumbnailUrl}
                    alt={b.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-8 w-8 text-neutral-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <h3 className="font-bold text-base leading-tight line-clamp-2 min-h-[2.5rem]">
                  {b.title}
                </h3>

                <div className="space-y-1.5 border-l-2 border-neutral-100 dark:border-neutral-800 pl-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <User className="h-3 w-3" /> {b.author || "Admin"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Calendar className="h-3 w-3" /> {formatDate(b.createdAt)}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono italic">
                    <FileText className="h-3 w-3" /> /{b.slug}
                  </div>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="pt-4 mt-auto border-t border-neutral-100 dark:border-neutral-800/50 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/admin/blogs/edit/${b.id}`}>
                    <AdminButton icon={Pencil} className="w-full text-[11px]">
                      Edit
                    </AdminButton>
                  </Link>
                  <form action={toggleBlogPublished} className="w-full">
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="published" value={String(b.published)} />
                    <AdminActionButton variant="ghost" className="w-full text-[11px]">
                      {b.published ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5 mr-1" /> Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5 mr-1" /> Publish
                        </>
                      )}
                    </AdminActionButton>
                  </form>
                </div>
                <form
                  action={deleteBlog}
                  className="w-full"
                  onSubmit={(e) => !confirm("Delete this post?") && e.preventDefault()}
                >
                  <input type="hidden" name="id" value={b.id} />
                  <AdminActionButton variant="danger" icon={Trash2} className="w-full text-[11px]">
                    Delete Post
                  </AdminActionButton>
                </form>
              </div>

              {/* Footer ID */}
              <div className="flex items-center text-[9px] text-neutral-400 font-mono pt-3 opacity-60">
                <Hash className="h-2.5 w-2.5 mr-1" />
                <span className="select-all">{b.id.slice(-12)}</span>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {blogs.length === 0 && (
        <AdminCard className="py-24 flex flex-col items-center justify-center text-center">
          <FileText className="h-10 w-10 text-neutral-300 mb-4" />
          <h3 className="text-lg font-bold">No posts found</h3>
          <p className="text-neutral-500 text-sm max-w-xs mx-auto">
            {q ? `No results for "${q}"` : "Get started by writing your first blog post."}
          </p>
        </AdminCard>
      )}
    </div>
  );
}