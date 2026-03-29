"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/* ICONS */
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Search,
  X,
  RefreshCw,
  Hash,
  Layers,
} from "lucide-react";

/* COMPONENTS */
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPagination from "@/components/admin/AdminPagination";
import PageHeader from "@/components/public/ui/PageHeader";

/* UTILS */
import { cn } from "@/lib/cn";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { deleteBanner, toggleBanner } from "./serverActions";

export default function AdminBannersClient({
  banners = [],
  total,
  page,
  q,
}: {
  banners: any[];
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
      router.push(`/admin/banners?page=${newPage}${query}`);
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-12">
      {/* 1. GLOBAL HEADER SYSTEM */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
        <PageHeader
          title="Popup Banners"
          subtitle={`Promotional popups (${total})`}
          align="left"
          className="max-w-none m-0 p-0"
        />

        <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
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
          <Link href="/admin/banners/new" className="w-full lg:w-auto">
            <AdminButton variant="primary" icon={Plus} className="w-full sm:min-w-[215px]">
              New Banner
            </AdminButton>
          </Link>
        </div>
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />

      {/* 2. SEARCH SYSTEM */}
      <AdminCard compact className="!p-3 border-dashed bg-neutral-50/50 dark:bg-neutral-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search banners by title..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {inputValue && (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 cursor-pointer hover:text-red-500"
                onClick={() => {
                  setInputValue("");
                  router.push("/admin/banners?page=1");
                }}
              />
            )}
          </div>
          <AdminButton type="submit" icon={Search}>
            Search
          </AdminButton>
        </form>
      </AdminCard>

      {/* 3. GLOBAL GRID SYSTEM (3-COLUMN LAYOUT) */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        {banners.map((b, idx) => {
          const displayIndex = (page - 1) * ADMIN_PAGE_SIZE + (idx + 1);

          return (
            <AdminCard
              key={b.id}
              compact
              index={displayIndex}
              className="group flex flex-col h-full border-t-4 border-t-neutral-200 dark:border-t-neutral-700 hover:border-t-primary/50 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <AdminBadge status={b.isActive ? "VISIBLE" : "HIDDEN"} />
                <div className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
                  <Layers className="h-2.5 w-2.5" /> {b.type}
                </div>
              </div>

              {/* Preview Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mb-4 shrink-0">
                {b.imageUrl ? (
                  <Image
                    src={b.imageUrl}
                    alt={b.title || ""}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-8 w-8 text-neutral-300" />
                  </div>
                )}
              </div>

              {/* Banner Details */}
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
                  {b.title || "Untitled Banner"}
                </h3>
                <p className="text-[11px] text-neutral-500 line-clamp-1 italic">
                  {b.link ? b.link : "No redirect link set"}
                </p>
              </div>

              {/* Actions Grid */}
              <div className="pt-4 mt-auto border-t border-neutral-100 dark:border-neutral-800/50 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/admin/banners/edit/${b.id}`}>
                    <AdminButton icon={Pencil} className="w-full text-[11px]">
                      Edit
                    </AdminButton>
                  </Link>
                  <form action={toggleBanner} className="w-full">
                    <input type="hidden" name="id" value={b.id} />
                    <AdminActionButton variant="ghost" className="w-full text-[11px]">
                      {b.isActive ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" /> Show
                        </>
                      )}
                    </AdminActionButton>
                  </form>
                </div>
                <form
                  action={deleteBanner}
                  className="w-full"
                  onSubmit={(e) => !confirm("Delete this banner?") && e.preventDefault()}
                >
                  <input type="hidden" name="id" value={b.id} />
                  <AdminActionButton variant="danger" icon={Trash2} className="w-full text-[11px]">
                    Delete Banner
                  </AdminActionButton>
                </form>
              </div>

              {/* Footer ID */}
              <div className="flex items-center text-[9px] text-neutral-400 font-mono pt-3 opacity-60">
                <Hash className="h-2.5 w-2.5 mr-1" />
                <span className="select-all">{b.id.slice(-12)}</span>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {banners.length === 0 && (
        <AdminCard className="py-24 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
            <Layers className="h-8 w-8 text-neutral-300" />
          </div>
          <h3 className="text-lg font-bold">No banners found</h3>
          <p className="text-neutral-500 text-sm max-w-xs mx-auto">
            {q ? `No results for "${q}"` : "Create your first popup banner to engage your users."}
          </p>
        </AdminCard>
      )}
    </div>
  );
}