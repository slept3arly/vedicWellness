"use client";

import Link from "next/link";
import { createMarqueeItem } from "../serverActions";
import PageHeader from "@/components/public/ui/PageHeader";

export default function MarqueeNewForm() {
  return (
    <div className="p-6 max-w-[600px] mx-auto">
      <PageHeader
        title="Add Marquee Text"
        subtitle="Create a new announcement for the homepage slider"
      />

      <form action={createMarqueeItem} className="mt-6 grid gap-4">
        <div className="grid gap-1.5">
          <label className="text-sm font-semibold">
            Announcement Content
          </label>
          <input
            name="text"
            placeholder="e.g., NEW PRODUCTS LIVE NOW"
            className="w-full px-3 py-2 rounded-lg border"
            required
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-semibold">
            Display Order
          </label>
          <input
            name="order"
            type="number"
            defaultValue="0"
            className="w-full px-3 py-2 rounded-lg border"
          />
        </div>

        <label className="flex gap-2 items-center">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked
          />
          <span className="text-sm">Publish immediately</span>
        </label>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold"
          >
            Create Item
          </button>

          <Link href="/admin/marquee" className="text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}