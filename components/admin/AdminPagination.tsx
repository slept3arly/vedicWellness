"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  isPending: boolean;
  onPageChange: (newPage: number) => void;
}

export default function AdminPagination({
  page,
  totalPages,
  isPending,
  onPageChange,
}: AdminPaginationProps) {
  return (
    <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || isPending}
        className="p-1.5 hover:bg-white dark:hover:bg-neutral-700 rounded-md disabled:opacity-30 transition-all active:scale-95"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
      </button>

      <div className="flex flex-col items-center px-3 min-w-[85px]">
        <span className="text-[10px] uppercase font-bold text-neutral-400 leading-none mb-0.5">
          Page
        </span>
        <span className="text-[11px] font-black tabular-nums text-neutral-700 dark:text-neutral-200">
          {page} <span className="text-neutral-400 font-normal">of</span> {totalPages || 1}
        </span>
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || isPending}
        className="p-1.5 hover:bg-white dark:hover:bg-neutral-700 rounded-md disabled:opacity-30 transition-all active:scale-95"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
      </button>
    </div>
  );
}