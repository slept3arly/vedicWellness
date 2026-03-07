"use client";

import Link from "next/link";
import { updateMarqueeItem } from "../../serverActions";
import PageHeader from "@/components/public/ui/PageHeader";

export default function MarqueeEditForm({ item }: { item: any }) {
  return (
    <div className="p-6 max-w-[600px]">
      <PageHeader title="Edit Marquee Text" />

      <form
        action={updateMarqueeItem}
        className="mt-4 grid gap-3"
      >
        <input type="hidden" name="id" value={item.id} />

        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Announcement Text</label>
          <input 
            name="text" 
            defaultValue={item.text} 
            placeholder="Enter marquee text..."
            required 
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Display Order</label>
          <input 
            name="order" 
            type="number"
            defaultValue={String(item.order)} 
          />
        </div>

        <label className="flex gap-2 items-center cursor-pointer py-2">
          <input 
            name="isActive" 
            type="checkbox" 
            defaultChecked={item.isActive} 
          />
          <span className="text-sm font-medium">Active</span>
        </label>

        <div className="flex gap-3 mt-2">
          <button type="submit">Save Changes</button>
          <Link 
            href="/admin/marquee" 
            className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}