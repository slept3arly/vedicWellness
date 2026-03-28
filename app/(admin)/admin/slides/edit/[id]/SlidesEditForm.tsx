"use client";

import { useState } from "react";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import SlideImagesField from "@/components/admin/SlideImagesField";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { updateSlide } from "../../serverActions";

const PLACEMENTS = [
  { value: "HOME_HERO", label: "Home Hero" },
  { value: "HOME_SECONDARY", label: "Home Secondary" },
  { value: "BLOGS_TOP", label: "Blogs Top" },
  { value: "CATEGORY_TOP", label: "Category Top" },
  { value: "FESTIVAL_BANNER", label: "Festival Banner" },
];

function formatDateTimeLocal(date?: Date | null) {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 16);
}

type SlideWithPlacements = Prisma.SlideGetPayload<{ include: { placements: true } }>;

export default function SlideEditForm({ slide }: { slide: SlideWithPlacements }) {
  const placement = slide.placements[0];

  const [desktopUrl, setDesktopUrl] = useState(slide.imageDesktopUrl);
  const [mobileUrl, setMobileUrl] = useState(slide.imageMobileUrl);

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <PageHeader
        title="Edit Slide"
        subtitle="Update placement, scheduling and images"
      />

      <form action={updateSlide} className="space-y-6">
        <input type="hidden" name="id" value={slide.id} />
        <input type="hidden" name="imageDesktopUrl" value={desktopUrl} />
        <input type="hidden" name="imageMobileUrl" value={mobileUrl} />

        {/* Images */}
        <div className="border rounded-xl p-5 space-y-4">
          <SectionHeading title="Images" />

          <SlideImagesField
            desktopUrl={desktopUrl}
            setDesktopUrl={setDesktopUrl}
            mobileUrl={mobileUrl}
            setMobileUrl={setMobileUrl}
          />
        </div>

        {/* Placement Settings */}
        <div className="border rounded-xl p-5 space-y-4">
          <SectionHeading title="Placement Settings" />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Placement</label>
              <select
                name="placementKey"
                defaultValue={placement?.placementKey}
                className="w-full border rounded-lg p-2 bg-background"
                required
              >
                {PLACEMENTS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Order</label>
              <input
                type="number"
                name="order"
                defaultValue={placement?.order ?? 0}
                className="w-full border rounded-lg p-2 bg-background"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={placement?.isActive}
            />
            Active
          </label>
        </div>

        {/* Scheduling */}
        <div className="border rounded-xl p-5 space-y-4">
          <SectionHeading title="Scheduling (Optional)" />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Start At</label>
              <input
                type="datetime-local"
                name="startAt"
                defaultValue={formatDateTimeLocal(placement?.startAt)}
                className="w-full border rounded-lg p-2 bg-background"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">End At</label>
              <input
                type="datetime-local"
                name="endAt"
                defaultValue={formatDateTimeLocal(placement?.endAt)}
                className="w-full border rounded-lg p-2 bg-background"
              />
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Leave empty to show always. Expired slides auto-hide.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
          >
            Update Slide
          </button>

          <Link href="/admin/slides" className="px-4 py-2 rounded-lg border">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}