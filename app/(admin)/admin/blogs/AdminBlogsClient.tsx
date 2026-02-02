"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Image as ImageIcon } from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminButton from "../../../../components/admin/AdminButton";
import AdminBadge from "../../../../components/admin/AdminBadge";
import { deleteBlog, toggleBlogPublished } from "./serverActions";

export default function AdminBlogsClient({
  blogs,
  page,
  q,
}: {
  blogs: any[];
  page: number;
  q: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. Local state for the input field to keep it snappy and keep focus
  const [searchTerm, setSearchTerm] = useState(q);

useEffect(() => {
  setSearchTerm(q);
}, [q]);

useEffect(() => {
  const t = setTimeout(() => {
    if (searchTerm !== q) {
      const p = new URLSearchParams(params.toString());
      if (!searchTerm) p.delete("q");
      else p.set("q", searchTerm);
      p.set("page", "1");

      startTransition(() => {
        router.replace(`?${p.toString()}`);
      });
    }
  }, 500);

  return () => clearTimeout(t);
}, [searchTerm, q, params, router]);


  function updatePage(newPage: number) {
    const p = new URLSearchParams(params.toString());
    p.set("page", String(newPage));
    startTransition(() => {
      router.replace(`?${p.toString()}`);
    });
  }

  return (
    <div className={`max-w-6xl mx-auto space-y-6 px-4`}>
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/admin/blogs/new">
          <AdminButton>+ New Post</AdminButton>
        </Link>
      </div>

      {/* Search - Notice value and onChange change */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs..."
          className="h-12 w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-4 text-sm dark:bg-neutral-900 dark:border-neutral-700"
        />
        {isPending && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 animate-pulse">
            Searching...
          </div>
        )}
      </div>

      {/* Blogs List */}
      <div className={`space-y-4 transition-opacity duration-200 ${
    isPending ? "opacity-40" : "opacity-100"
  }`}>
        {blogs.length > 0 ? (
          blogs.map((b, index) => (
            <AdminCard key={b.id} className="flex flex-col md:flex-row gap-4">
               {/* ... (Keep your existing card rendering logic here) ... */}
               <div className="w-6 text-neutral-500 pt-2">
                {(page - 1) * 25 + index + 1}.
              </div>

              <div className="w-20 h-20 rounded-lg bg-neutral-200 flex items-center justify-center shrink-0">
                {b.thumbnailUrl ? (
                  <img src={b.thumbnailUrl} alt={b.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-neutral-500" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold">{b.title}</h2>
                  <AdminBadge status={b.published ? "ACTIVE" : "INACTIVE"} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-neutral-600">
                  <div><span className="block text-neutral-400 uppercase font-bold text-[9px]">Author</span>{b.author || "—"}</div>
                  <div><span className="block text-neutral-400 uppercase font-bold text-[9px]">Category</span>{b.category || "—"}</div>
                  <div><span className="block text-neutral-400 uppercase font-bold text-[9px]">Slug</span>{b.slug}</div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2">
                <Link href={`/admin/blogs/edit/${b.id}`}>
                  <AdminButton className="w-full">Edit</AdminButton>
                </Link>
                <form action={toggleBlogPublished}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="published" value={String(b.published)} />
                  <AdminButton className="w-full">{b.published ? "Unpublish" : "Publish"}</AdminButton>
                </form>
              </div>
            </AdminCard>
          ))
        ) : (
          <div className="py-10 text-center rounded-lg border border-neutral-300 bg-white pl-11 pr-4 text-sm dark:bg-neutral-900 dark:border-neutral-700">
            No blogs found. Try Searching Again.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between pt-6">
        <button
          disabled={page === 1 || isPending}
          onClick={() => updatePage(page - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-30 hover:bg-neutral-50"
        >
          ← Previous
        </button>

        <button
          disabled={blogs.length < 25 || isPending}
          onClick={() => updatePage(page + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-30 hover:bg-neutral-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}