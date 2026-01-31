"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Pencil,
  CheckSquare,
  Square,
  Calendar,
  User,
  Folder,
  Image as ImageIcon,
} from "lucide-react";

import AdminCard from "../components/ui/AdminCard";
import AdminButton from "../components/ui/AdminButton";
import AdminBadge from "../components/ui/AdminBadge";
import { deleteBlog, toggleBlogPublished } from "./serverActions";

function formatDate(date?: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function AdminBlogsClient({ blogs }: { blogs: any[] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      blogs.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      ),
    [blogs, search]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/admin/blogs/new">
          <AdminButton>+ New Post</AdminButton>
        </Link>
      </div>

      {/* Full width search */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blogs..."
          className="h-12 w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-4 text-sm dark:bg-neutral-900 dark:border-neutral-700"
        />
      </div>

      {/* Row list */}
      {filtered.map((b, index) => {
  const isSelected = selected.includes(b.id);

  return (
    <AdminCard
  key={b.id}
  className={`flex flex-col md:flex-row items-start gap-4 md:gap-6 transition ${
    isSelected
      ? "ring-2 ring-emerald-500"
      : "hover:shadow-md"
  }`}
>
  {/* Row number */}
  <div className="text-sm text-neutral-500 pt-2 w-6 shrink-0">
    {index + 1}.
  </div>

  {/* Thumbnail */}
  <div className="w-20 h-20 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
    {b.thumbnailUrl ? (
      <img
        src={b.thumbnailUrl}
        alt={b.title}
        className="w-full h-full object-cover rounded-lg"
      />
    ) : (
      <ImageIcon className="h-6 w-6 text-neutral-500" />
    )}
  </div>

  {/* Info */}
  <div className="flex-1 space-y-3">

    {/* Title */}
    <div className="flex justify-between items-start gap-4">
      <h2 className="font-semibold text-lg leading-snug text-neutral-900 dark:text-white">
        {b.title}
      </h2>
      <AdminBadge status={b.published ? "ACTIVE" : "INACTIVE"} />
    </div>

    {/* Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-2 text-sm">

      <div>
        <div className="text-neutral-600 dark:text-neutral-400">
          Author
        </div>
        <div className="text-neutral-900 dark:text-white break-words">
          {b.author || "—"}
        </div>
      </div>

      <div>
        <div className="text-neutral-600 dark:text-neutral-400">
          Category
        </div>
        <div className="text-neutral-900 dark:text-white break-words">
          {b.category || "—"}
        </div>
      </div>

      <div>
        <div className="text-neutral-600 dark:text-neutral-400">
          Published
        </div>
        <div className="text-neutral-900 dark:text-white">
          {formatDate(b.publishedAt)}
        </div>
      </div>

      <div>
        <div className="text-neutral-600 dark:text-neutral-400">
          Slug
        </div>
        <div className="text-neutral-900 dark:text-white break-all">
          /blog/{b.slug}
        </div>
      </div>

    </div>
  </div>

  {/* Actions */}
  <div className="flex flex-row md:flex-col gap-2 md:gap-3 pt-2 w-full md:w-auto">
    <Link href={`/admin/blogs/edit/${b.id}`}>
      <AdminButton className="w-full">Edit</AdminButton>
    </Link>

    <form action={toggleBlogPublished}>
      <input type="hidden" name="id" value={b.id} />
      <input type="hidden" name="published" value={String(b.published)} />
      <AdminButton className="w-full">
        {b.published ? "Unpublish" : "Publish"}
      </AdminButton>
    </form>

    <form action={deleteBlog}>
      <input type="hidden" name="id" value={b.id} />
      <AdminButton variant="danger" className="w-full">
        Delete
      </AdminButton>
    </form>
  </div>
</AdminCard>

  );
})}
      </div>
  );
}
