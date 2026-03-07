"use client";

import Link from "next/link";
import { createMarqueeItem } from "../serverActions";
import PageHeader from "@/components/public/ui/PageHeader";

export default function NewMarqueeItemPage() {
  return (
    <div className="p-6 max-w-[600px] mx-auto">
      {/* ── Header ── */}
      <PageHeader 
        title="Add Marquee Text" 
        subtitle="Create a new announcement for the homepage slider"
      />

      {/* ── Form ── */}
      <form 
        action={createMarqueeItem} 
        className="mt-6 grid gap-4"
      >
        <div className="grid gap-1.5">
          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Announcement Content
          </label>
          <input 
            name="text" 
            placeholder="e.g., NEW PRODUCTS LIVE NOW" 
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-black outline-none transition-all"
            required 
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Display Order
          </label>
          <input 
            name="order" 
            type="number"
            placeholder="0 = first" 
            defaultValue="0" 
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-black outline-none transition-all"
          />
        </div>

        <label className="flex gap-2 items-center cursor-pointer group w-fit">
          <input 
            name="isActive" 
            type="checkbox" 
            defaultChecked 
            className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
          />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors">
            Publish immediately
          </span>
        </label>

        {/* ── Footer Actions ── */}
        <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <button 
            type="submit"
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Create Item
          </button>
          <Link 
            href="/admin/marquee" 
            className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}