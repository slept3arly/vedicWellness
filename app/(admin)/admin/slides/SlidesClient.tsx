"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminActionButton from "@/components/admin/AdminActionButton";
import PageHeader from "@/components/public/ui/PageHeader";
import { deleteSlide } from "./serverActions";
import { Pencil, Trash2, ImageIcon, Plus, LayoutGrid } from "lucide-react";

/* ------------------------------------------------------------------ */

export default function SlidesClient({ slides }: { slides: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <PageHeader 
          title="Slides" 
          subtitle="Manage your hero slideshow" 
        />
        <Link href="/admin/slides/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            Add Slide
          </AdminButton>
        </Link>
      </div>

      {/* ── Slides List ── */}
      <div className={`space-y-3 transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        {slides.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-neutral-300" />
            <p className="font-medium text-slate-600 dark:text-slate-300">No slides yet</p>
            <Link href="/admin/slides/new" className="text-sm text-neutral-400 underline underline-offset-2 hover:text-black dark:hover:text-white">
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
                <span className="text-xs text-neutral-400 tabular-nums w-5 text-center">
                  {index + 1}
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
                  {s.placements?.length > 0 ? (
                    s.placements.map((p: any) => (
                      <Meta key={p.id} label={`Placement · Order ${p.order}`}>
                        <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
                        <span className="break-all">{p.placementKey}</span>
                      </Meta>
                    ))
                  ) : (
                    <p className="text-xs text-slate-600 dark:text-slate-300">No placements assigned</p>
                  )}
                </div>
              </div>

              {/* ── Right: actions — 2 buttons, column desktop ── */}
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
                    if (!confirm("Delete this slide permanently?")) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={s.id} />
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