"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Trash2,
  Pencil,
  Calendar,
  ArrowUpDown,
  Eye,
  EyeOff,
  Type,
  Plus,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminButton from "../../../../components/admin/AdminButton";
import AdminBadge from "../../../../components/admin/AdminBadge";
import PageHeader from "@/components/public/ui/PageHeader";

import { deleteMarqueeItem, toggleMarqueeItem } from "./serverActions";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default function AdminMarqueeClient({
  marqueeItems = [],
  total,
  q,
  page,
}: {
  marqueeItems: any[];
  total: number;
  q: string;
  page: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(q);

  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (inputValue) p.set("q", inputValue);
    p.set("page", "1");
    startTransition(() => router.push(`?${p.toString()}`));
  }

  const handleClear = () => {
    setInputValue("");
    startTransition(() => router.push("?page=1"));
  };

  const handlePageChange = (newPage: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    p.set("page", newPage.toString());
    startTransition(() => router.push(`?${p.toString()}`));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <PageHeader
          title="Marquee Text"
          subtitle="Homepage scrolling announcements"
        />
        <Link href="/admin/marquee/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            Add Text
          </AdminButton>
        </Link>
      </div>

      {/* ── Search Bar ── */}
      <AdminCard className="p-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search marquee text..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-black"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <AdminButton type="submit" disabled={isPending}>
            Search
          </AdminButton>
        </form>

        <div className="mt-2 text-[10px] text-neutral-400 flex justify-between px-1">
          <span>Found {total} items</span>
          <span>
            Page {page} of {totalPages || 1}
          </span>
        </div>
      </AdminCard>

      {/* ── Items List ── */}
      <div
        className={`space-y-3 transition-opacity duration-200 ${
          isPending ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {marqueeItems.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <Type className="h-8 w-8 text-neutral-300" />
            <p className="font-semibold text-neutral-500">
              No marquee items found
            </p>
          </AdminCard>
        ) : (
          marqueeItems.map((m, index) => (
            <AdminCard
              key={m.id}
              className="flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
            >
              {/* ── Left: index ── */}
              <div className="flex sm:flex-col items-center gap-3 sm:gap-2 shrink-0">
                <span className="text-xs text-neutral-400 tabular-nums w-5 text-center">
                  {(page - 1) * ADMIN_PAGE_SIZE + index + 1}
                </span>

                <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shrink-0">
                  <Type className="h-5 w-5 text-neutral-400" />
                </div>
              </div>

              {/* ── Middle: content ── */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-xl font-semibold leading-snug line-clamp-2 break-words">
                    {m.text}
                  </h3>
                  <AdminBadge
                    status={m.isActive ? "ACTIVE" : "INACTIVE"}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                  <Meta label="Order">
                    <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
                    <span>{m.order}</span>
                  </Meta>

                  <Meta label="Visibility">
                    {m.isActive ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {m.isActive ? "Visible" : "Hidden"}
                    </span>
                  </Meta>

                  <Meta label="Created">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {new Date(m.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </Meta>
                </div>
              </div>

              {/* ── Right: actions ── */}
              <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 shrink-0 sm:w-36">
                <Link
                  href={`/admin/marquee/edit/${m.id}`}
                  className="w-full"
                >
                  <AdminButton className="w-full justify-center">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </AdminButton>
                </Link>

                <form action={toggleMarqueeItem} className="w-full">
                  <input type="hidden" name="id" value={m.id} />
                  <AdminActionButton className="w-full justify-center">
                    {m.isActive ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    {m.isActive ? "Unpublish" : "Publish"}
                  </AdminActionButton>
                </form>

                <form
                  action={deleteMarqueeItem}
                  className="w-full col-span-2 sm:col-span-1"
                  onSubmit={(e) =>
                    !confirm("Delete permanently?") && e.preventDefault()
                  }
                >
                  <input type="hidden" name="id" value={m.id} />
                  <AdminActionButton
                    variant="danger"
                    className="w-full justify-center"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </AdminActionButton>
                </form>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4 pb-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isPending}
            className="p-2 rounded-full border border-neutral-300 disabled:opacity-30 hover:bg-neutral-100 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-sm font-medium">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || isPending}
            className="p-2 rounded-full border border-neutral-300 disabled:opacity-30 hover:bg-neutral-100 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium mb-0.5">
        {label}
      </div>
      <div className="flex items-center gap-1 text-sm text-neutral-800 dark:text-neutral-100">
        {children}
      </div>
    </div>
  );
}