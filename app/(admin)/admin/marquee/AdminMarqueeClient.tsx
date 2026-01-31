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
  ArrowUpDown,
  Eye,
  EyeOff,
  Type,
} from "lucide-react";

import AdminCard from "../components/ui/AdminCard";
import AdminButton from "../components/ui/AdminButton";
import AdminBadge from "../components/ui/AdminBadge";
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
}: {
  items: any[];
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      items.filter((i) =>
        i.text.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  );

  function toggleSelect(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* Header */}
      <div className="flex justify-between items-center">
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

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search marquee text..."
          className="h-12 w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-4 text-sm dark:bg-neutral-900 dark:border-neutral-700"
        />
      </div>

      {/* Row list */}
      {filtered.map((m, index) => {
        const isSelected = selected.includes(m.id);

        return (
          <AdminCard
            key={m.id}
            className={`flex items-start gap-6 transition ${
              isSelected
                ? "ring-2 ring-emerald-500"
                : "hover:shadow-md"
            }`}
          >
            {/* Row number */}
            <div className="text-sm text-neutral-500 pt-2 w-6 shrink-0">
              {index + 1}.
            </div>

            {/* Icon */}
            <div className="w-16 h-16 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <Type className="h-6 w-6 text-neutral-500" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">

              {/* Text + status */}
              <div className="flex justify-between items-start gap-4">
                <p className="font-medium text-lg leading-snug line-clamp-2">
                  {m.text}
                </p>

                <AdminBadge
                  status={m.isActive ? "ACTIVE" : "INACTIVE"}
                />
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-2 text-sm">

                <div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Order
                  </div>
                  <div className="text-neutral-900 dark:text-white flex items-center gap-1">
                    <ArrowUpDown className="h-4 w-4" />
                    {m.order}
                  </div>
                </div>

                <div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Created
                  </div>
                  <div className="text-neutral-900 dark:text-white flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(m.createdAt)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Status
                  </div>
                  <div className="text-neutral-900 dark:text-white">
                    {m.isActive ? "Visible" : "Hidden"}
                  </div>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">

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
                      <EyeOff className="h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Show
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
        );
      })}
    </div>
  );
}
