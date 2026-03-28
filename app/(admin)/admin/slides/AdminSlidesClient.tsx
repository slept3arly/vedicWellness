"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  ImageIcon,
  Plus,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import type { SlideListItem } from "@/lib/db/slide";

import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminActionButton from "@/components/admin/AdminActionButton";
import PageHeader from "@/components/public/ui/PageHeader";

import { deleteSlide } from "./serverActions";



// add q to props, remove limit usage

export default function AdminSlidesClient({
  slides,
  total,
  page,
  q,
}: {
  slides: SlideListItem[];
  total: number;
  page: number;
  q: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const query = q ? `&q=${encodeURIComponent(q)}` : "";
      router.push(`/admin/slides?page=${newPage}${query}`);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <PageHeader
          title="Slides"
          subtitle={`Manage your hero slideshow (${total} total)`}
        />

        <Link href="/admin/slides/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            Add Slide
          </AdminButton>
        </Link>
      </div>

      {/* ── Slides List ── */}
      <div
        className={`space-y-3 transition-opacity duration-200 ${
          isPending ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {slides.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-neutral-300" />
            <p className="font-medium text-slate-600 dark:text-slate-300">
              No slides yet
            </p>
            <Link
              href="/admin/slides/new"
              className="text-sm text-neutral-400 underline underline-offset-2 hover:text-black dark:hover:text-white"
            >
              Add your first slide
            </Link>
          </AdminCard>
        ) : (
          slides.map((s, index) => (
            <AdminCard
              key={s.id}
              className="flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
            >
              {/* ── Left: index + image ── */}
              <div className="flex sm:flex-col items-center gap-3 sm:gap-2 shrink-0">
                <span className="text-xs text-neutral-400 tabular-nums w-5 text-center font-bold">
                  {(page - 1) * ADMIN_PAGE_SIZE + index + 1}
                </span>

                <div className="w-28 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
                  {s.imageDesktopUrl ? (
                    <Image
                      src={s.imageDesktopUrl}
                      alt=""
                      width={112}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-neutral-400" />
                  )}
                </div>
              </div>

              {/* ── Middle: placements ── */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {s.placements.length > 0 ? (
                    s.placements.map((p) => (
                      <Meta
                        key={p.id}
                        label={`Placement · Order ${p.order}`}
                      >
                        <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
                        <span className="break-all font-medium">
                          {p.placementKey}
                        </span>

                        {p.isActive ? (
                          <span className="ml-2 w-1.5 h-1.5 rounded-full bg-green-500" />
                        ) : (
                          <span className="ml-2 w-1.5 h-1.5 rounded-full bg-neutral-300" />
                        )}
                      </Meta>
                    ))
                  ) : (
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                      No placements assigned
                    </p>
                  )}
                </div>
              </div>

              {/* ── Right: actions ── */}
              <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 shrink-0 sm:w-36">
                <Link href={`/admin/slides/edit/${s.id}`} className="w-full">
                  <AdminButton className="w-full justify-center">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </AdminButton>
                </Link>

                <form
                  action={deleteSlide}
                  className="w-full"
                  onSubmit={(e) => {
                    if (!confirm("Delete this slide permanently?")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="id" value={s.id} />
                  <AdminActionButton
                    variant="danger"
                    className="w-full justify-center"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </AdminActionButton>
                </form>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6 pb-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isPending}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-sm font-medium">
            Page {page}
            <span className="text-neutral-400 mx-1">/</span>
            {totalPages}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || isPending}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ===============================
   META COMPONENT
================================ */

function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-bold mb-0.5">
        {label}
      </div>
      <div className="flex items-center gap-1 text-sm text-neutral-800 dark:text-neutral-100 min-w-0">
        {children}
      </div>
    </div>
  );
}