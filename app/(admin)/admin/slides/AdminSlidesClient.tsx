"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/* ICONS */
import {
  Pencil,
  Trash2,
  ImageIcon,
  Plus,
  LayoutGrid,
  RefreshCw,
  Search,
  X,
  Hash,
} from "lucide-react";

/* COMPONENTS */
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminPagination from "@/components/admin/AdminPagination";
import PageHeader from "@/components/public/ui/PageHeader";

/* UTILS */
import { cn } from "@/lib/cn";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import type { SlideListItem } from "@/lib/db/slide";
import { deleteSlide } from "./serverActions";

export default function AdminSlidesClient({
  slides = [],
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
  const [inputValue, setInputValue] = useState(q);
  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  const handleSync = () => startTransition(() => router.refresh());
  
  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const query = inputValue ? `&q=${encodeURIComponent(inputValue)}` : "";
      router.push(`/admin/slides?page=${newPage}${query}`);
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-12">
      
      {/* 1. GLOBAL HEADER SYSTEM (Left Aligned + 3-Button Hierarchy) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
        <PageHeader 
          title="Hero Slides" 
          subtitle={`Manage landing page slideshows (${total})`} 
          align="left" 
          className="max-w-none m-0 p-0" 
        />
        
        <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
          {/* Row 1: Pagination + Sync */}
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
          {/* Row 2: Primary Action */}
          <Link href="/admin/slides/new" className="w-full lg:w-auto">
            <AdminButton variant="primary" icon={Plus} className="w-full sm:min-w-[215px]">
              New Slide
            </AdminButton>
          </Link>
        </div>
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />

      {/* 2. SEARCH SYSTEM */}
      <AdminCard compact className="!p-3 border-dashed bg-neutral-50/50 dark:bg-neutral-900/50">
        <form 
          onSubmit={(e) => { e.preventDefault(); handlePageChange(1); }} 
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by placement key..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {inputValue && (
              <X 
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 cursor-pointer hover:text-red-500" 
                onClick={() => { setInputValue(""); router.push("/admin/slides?page=1"); }} 
              />
            )}
          </div>
          <AdminButton type="submit" icon={Search}>Search</AdminButton>
        </form>
      </AdminCard>

      {/* 3. GLOBAL GRID SYSTEM (3-COLUMN LAYOUT) */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        isPending && "opacity-50 pointer-events-none"
      )}>
        {slides.map((s, idx) => {
          const displayIndex = (page - 1) * ADMIN_PAGE_SIZE + (idx + 1);

          return (
            <AdminCard 
              key={s.id} 
              compact
              index={displayIndex}
              className="group flex flex-col h-full border-t-4 border-t-neutral-200 dark:border-t-neutral-700 hover:border-t-primary/50 transition-all"
            >
              {/* Image Preview Container */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0 mb-3">
                {s.imageDesktopUrl ? (
                  <Image
                    src={s.imageDesktopUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-8 w-8 text-neutral-300" />
                  </div>
                )}
              </div>

              {/* Placement Info */}
              <div className="flex-1 space-y-3">
                <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5">
                  <LayoutGrid className="h-3 w-3" />
                  Placements & Visibility
                </div>
                
                <div className="space-y-2">
                  {s.placements.length > 0 ? (
                    s.placements.map((p) => (
                      <div key={p.id} className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50 p-2 rounded-lg border border-neutral-100 dark:border-neutral-800/50">
                        <span className="text-xs font-bold truncate pr-2">{p.placementKey}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-neutral-400">Ord: {p.order}</span>
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            p.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-neutral-300"
                          )} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="italic text-[11px] text-neutral-400 py-2">No active placements</div>
                  )}
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="pt-4 mt-auto border-t border-neutral-100 dark:border-neutral-800/50 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/admin/slides/edit/${s.id}`}>
                    <AdminButton icon={Pencil} className="w-full text-[11px]">Edit</AdminButton>
                  </Link>
                  <form
                    action={deleteSlide}
                    onSubmit={(e) => !confirm("Delete slide?") && e.preventDefault()}
                  >
                    <input type="hidden" name="id" value={s.id} />
                    <AdminActionButton variant="danger" icon={Trash2} className="w-full text-[11px]">
                      Delete
                    </AdminActionButton>
                  </form>
                </div>
              </div>

              {/* Footer System ID */}
              <div className="flex items-center text-[9px] text-neutral-400 font-mono pt-3 opacity-60">
                <Hash className="h-2.5 w-2.5 mr-1" />
                <span className="select-all">{s.id.slice(-12)}</span>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {slides.length === 0 && (
        <AdminCard className="py-24 flex flex-col items-center justify-center text-center">
          <ImageIcon className="h-10 w-10 text-neutral-300 mb-4" />
          <h3 className="text-lg font-bold">No slides found</h3>
          <p className="text-neutral-500 text-sm">Try adjusting your search filters or add a new slide.</p>
        </AdminCard>
      )}
    </div>
  );
}