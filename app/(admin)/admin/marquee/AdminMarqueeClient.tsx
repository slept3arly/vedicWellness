"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/* ICONS */
import { 
  Trash2, Pencil, Calendar, Eye, EyeOff, 
  Plus, Search, X, RefreshCw, Hash, ListOrdered 
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
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { deleteMarqueeItem, toggleMarqueeItem } from "./serverActions";

export default function AdminMarqueeClient({ marqueeItems = [], total, q, page }: { marqueeItems: any[]; total: number; q: string; page: number; }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(q);
  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  const handleSync = () => startTransition(() => router.refresh());
  const handlePageChange = (p: number) => startTransition(() => router.push(`?q=${q}&page=${p}`));

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-12">
      
      {/* 1. GLOBAL HEADER SYSTEM */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
        <PageHeader 
          title="Marquee Text" 
          subtitle="Scrolling announcements" 
          align="left" 
          className="max-w-none m-0 p-0" 
        />
        
        <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <AdminPagination page={page} totalPages={totalPages} isPending={isPending} onPageChange={handlePageChange} />
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
          <Link href="/admin/marquee/new" className="w-full lg:w-auto">
            <AdminButton variant="primary" icon={Plus} className="w-full sm:min-w-[215px]">New Marquee</AdminButton>
          </Link>
        </div>
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />

      {/* 2. SEARCH SYSTEM */}
      <AdminCard compact className="!p-3 border-dashed bg-neutral-50/50 dark:bg-neutral-900/50">
        <form onSubmit={(e) => { e.preventDefault(); router.push(`?q=${inputValue}&page=1`); }} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search marquee items..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {inputValue && <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 cursor-pointer hover:text-red-500" onClick={() => setInputValue("")} />}
          </div>
          <AdminButton type="submit" icon={Search}>Search</AdminButton>
        </form>
      </AdminCard>

      {/* 3. GLOBAL GRID SYSTEM */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isPending ? "opacity-50" : ""}`}>
        {marqueeItems.map((m, idx) => {
          const displayIndex = (page - 1) * ADMIN_PAGE_SIZE + (idx + 1);

          return (
            <AdminCard 
              key={m.id} 
              compact 
              index={displayIndex}
              className="group flex flex-col h-full border-t-4 border-t-neutral-200 dark:border-t-neutral-700 hover:border-t-primary/50 transition-colors"
            >
              <div className="flex justify-between items-start pr-8">
                <AdminBadge status={m.isActive ? "VISIBLE" : "HIDDEN"} />
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                  <ListOrdered className="h-2.5 w-2.5" /> ORDER: {m.order}
                </div>
              </div>

              <div className="flex-1 py-3">
                <h3 className="text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-100 line-clamp-3">
                  {m.text}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-neutral-100 dark:border-neutral-800/50">
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Created</span>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                    <Calendar className="h-3 w-3 text-neutral-400" /> 
                    {new Date(m.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Visibility</span>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                    {m.isActive ? <Eye className="h-3 w-3 text-emerald-500" /> : <EyeOff className="h-3 w-3 text-amber-500" />} 
                    {m.isActive ? "Live" : "Hidden"}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/admin/marquee/edit/${m.id}`}>
                    <AdminButton icon={Pencil} className="w-full">Edit</AdminButton>
                  </Link>
                  <form action={toggleMarqueeItem} className="w-full">
                    <input type="hidden" name="id" value={m.id} />
                    <AdminActionButton variant="ghost" className="w-full">
                      {m.isActive ? <><EyeOff className="h-4 w-4" /> Hide</> : <><Eye className="h-4 w-4" /> Show</>}
                    </AdminActionButton>
                  </form>
                </div>
                <form action={deleteMarqueeItem} className="w-full" onSubmit={(e) => !confirm("Delete this marquee text?") && e.preventDefault()}>
                  <input type="hidden" name="id" value={m.id} />
                  <AdminActionButton variant="danger" icon={Trash2} className="w-full">Delete</AdminActionButton>
                </form>
              </div>

              <div className="flex items-center text-[9px] text-neutral-400 font-mono pt-3 mt-auto border-t border-neutral-50 dark:border-neutral-800/50">
                <Hash className="h-2.5 w-2.5 mr-1" />
                <span className="select-all opacity-70">{m.id.slice(-8)}</span>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}