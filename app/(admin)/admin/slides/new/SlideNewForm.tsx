"use client";

import { useState } from "react";
import Link from "next/link";
import { createSlide } from "../serverActions";
import SlideImagesField from "@/components/admin/SlideImagesField";

const PLACEMENTS = [
  { value: "HOME_HERO", label: "Home Hero" },
  { value: "HOME_SECONDARY", label: "Home Secondary" },
  { value: "BLOGS_TOP", label: "Blogs Top" },
  { value: "CATEGORY_TOP", label: "Category Top" },
  { value: "FESTIVAL_BANNER", label: "Festival Banner" },
];

export default function SlideNewForm() {
  const [desktopUrl, setDesktopUrl] = useState("");
  const [mobileUrl, setMobileUrl] = useState("");

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4">
      <div>
        <h1 className="text-2xl font-bold">Create Slide</h1>
        <p className="text-sm text-muted-foreground">
          Add a new banner slide.
        </p>
      </div>

      <form action={createSlide} className="space-y-6">

        <input type="hidden" name="imageDesktopUrl" value={desktopUrl} />
        <input type="hidden" name="imageMobileUrl" value={mobileUrl} />

        <SlideImagesField
          desktopUrl={desktopUrl}
          setDesktopUrl={setDesktopUrl}
          mobileUrl={mobileUrl}
          setMobileUrl={setMobileUrl}
        />

        {/* Placement */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Placement</label>
          <select name="placementKey" required className="input">
            <option value="">Select placement</option>
            {PLACEMENTS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Order */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Order</label>
          <input
            type="number"
            name="order"
            defaultValue={0}
            className="input"
          />
        </div>

        {/* Active */}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked />
          Active
        </label>

        {/* Scheduling */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start At</label>
            <input type="datetime-local" name="startAt" className="input" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">End At</label>
            <input type="datetime-local" name="endAt" className="input" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="admin-btn">
            Create Slide
          </button>
          <Link href="/admin/slides" className="admin-btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
