"use client";

import Link from "next/link";
import { useTransition } from "react";
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
} from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminButton from "../../../../components/admin/AdminButton";
import AdminBadge from "../../../../components/admin/AdminBadge";
import { deleteMarqueeItem, toggleMarqueeItem } from "./serverActions";

/* ------------------------------------------------------------------ */

function formatDate(d?: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/* ------------------------------------------------------------------ */

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
  const [isPending, startTransition] = useTransition();

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Marquee Text</h1>
          <p className="text-sm text-neutral-500">Homepage scrolling announcements</p>
        </div>
        <Link href="/admin/marquee/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            Add Text
          </AdminButton>
        </Link>
      </div>

      {/* ── Items List ── */}
      <div className={`space-y-3 transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        {items.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <Type className="h-8 w-8 text-neutral-300" />
            <p className="font-medium text-neutral-500">No marquee items yet</p>
            <Link href="/admin/marquee/new" className="text-sm text-neutral-400 underline underline-offset-2 hover:text-black dark:hover:text-white">
              Add your first item
            </Link>
          </AdminCard>
        ) : (
          items.map((m, index) => (
            <AdminCard
              key={m.id}
              className="flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
            >
              {/* ── Left: index + icon ── */}
              <div className="flex sm:flex-col items-center gap-3 sm:gap-2 shrink-0">
                <span className="text-xs text-neutral-400 tabular-nums w-5 text-center">
                  {(page - 1) * 12 + index + 1}
                </span>
                <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shrink-0">
                  <Type className="h-5 w-5 text-neutral-400" />
                </div>
              </div>

              {/* ── Middle: text + meta ── */}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-base leading-snug line-clamp-2 break-words">
                      {m.text}
                    </p>
                    <AdminBadge status={m.isActive ? "ACTIVE" : "INACTIVE"} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                  <Meta label="Order">
                    <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
                    <span>{m.order}</span>
                  </Meta>
                  <Meta label="Status">
                    {m.isActive
                      ? <><Eye className="h-3.5 w-3.5 shrink-0" /><span>Visible</span></>
                      : <><EyeOff className="h-3.5 w-3.5 shrink-0" /><span>Hidden</span></>
                    }
                  </Meta>
                  <Meta label="Created">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatDate(m.createdAt)}</span>
                  </Meta>
                </div>
              </div>

              {/* ── Right: actions — 2×2 mobile, column desktop ── */}
              <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 shrink-0 sm:w-36">
                <AdminButton
                  className="w-full justify-center"
                  onClick={() => startTransition(() => router.push(`/admin/marquee/edit/${m.id}`))}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </AdminButton>

                <form action={toggleMarqueeItem} className="w-full">
                  <input type="hidden" name="id" value={m.id} />
                  <AdminActionButton className="w-full justify-center">
                    {m.isActive
                      ? <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
                      : <><Eye className="h-3.5 w-3.5" /> Publish</>
                    }
                  </AdminActionButton>
                </form>

                <form
                  action={deleteMarqueeItem}
                  className="w-full col-span-2 sm:col-span-1"
                  onSubmit={(e) => { if (!confirm("Delete this marquee text permanently?")) e.preventDefault(); }}
                >
                  <input type="hidden" name="id" value={m.id} />
                  <AdminActionButton variant="danger" className="w-full justify-center">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </AdminActionButton>
                </form>
              </div>

            </AdminCard>
          ))
        )}
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
      <div className="flex items-center gap-1 text-sm text-neutral-800 dark:text-neutral-100 min-w-0">
        {children}
      </div>
    </div>
  );
}