"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Search,
  Trash2,
  Pencil,
  Calendar,
  ArrowUpDown,
  Eye,
  EyeOff,
  Type,
} from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminButton from "../../../../components/admin/AdminButton";
import AdminBadge from "../../../../components/admin/AdminBadge";
import { deleteMarqueeItem, toggleMarqueeItem } from "./serverActions";

function formatDate(d?: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export default function AdminMarqueeClient({
  items,
  q,
  page,
}: {
  items: any[];
  q: string;
  page: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /* 🔍 upgraded search */
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== q) {
        const p = new URLSearchParams(params.toString());

        if (!search) p.delete("q");
        else p.set("q", search);

        p.set("page", "1");

        startTransition(() => {
          router.replace(`?${p.toString()}`);
        });
      }
    }, 400);

    return () => clearTimeout(t);
  }, [search, q, params, router]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 overflow-x-hidden">

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Marquee Text</h1>
          <p className="text-sm text-neutral-500">
            Homepage scrolling announcements
          </p>
        </div>

        <Link href="/admin/marquee/new">
          <AdminButton>+ Add Text</AdminButton>
        </Link>
      </div>

      {/* 🔍 fixed search */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search marquee text..."
          className="h-12 w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-4 text-sm dark:bg-neutral-900 dark:border-neutral-700 focus:ring-2 focus:ring-black outline-none"
        />

        {isPending && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 animate-pulse">
            Searching...
          </span>
        )}
      </div>

      {/* 📉 fade rows while searching */}
      <div
        className={`space-y-4 transition-opacity duration-200 ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        {items.map((m, index) => (
          <AdminCard
            key={m.id}
            className="flex flex-col md:flex-row items-start gap-4 md:gap-6 transition hover:shadow-md"
          >
            <div className="text-sm text-neutral-500 pt-2 w-6 shrink-0">
              {(page - 1) * 20 + index + 1}.
            </div>

            <div className="w-16 h-16 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <Type className="h-6 w-6 text-neutral-500" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                <p className="font-medium text-lg leading-snug line-clamp-2 break-words">
                  {m.text}
                </p>

                <AdminBadge
                  status={m.isActive ? "ACTIVE" : "INACTIVE"}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-2 text-sm">

                <div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Order
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowUpDown className="h-4 w-4" />
                    {m.order}
                  </div>
                </div>

                <div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Created
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(m.createdAt)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Status
                  </div>
                  <div>
                    {m.isActive ? "Visible" : "Hidden"}
                  </div>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-3 sm:flex sm:flex-col gap-2 pt-2 w-full sm:w-auto">

              <Link href={`/admin/marquee/edit/${m.id}`}>
                <AdminButton className="w-full">
                  <Pencil className="h-4 w-4" />
                  Edit
                </AdminButton>
              </Link>

              <form action={toggleMarqueeItem}>
                <input type="hidden" name="id" value={m.id} />
                <AdminButton className="w-full">
                  {m.isActive ? (
                    <>
                      <EyeOff className="h-4 w-4" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" /> Show
                    </>
                  )}
                </AdminButton>
              </form>

              <form action={deleteMarqueeItem}>
                <input type="hidden" name="id" value={m.id} />
                <AdminButton variant="danger" className="w-full">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </AdminButton>
              </form>

            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
