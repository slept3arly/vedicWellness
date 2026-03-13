"use client";

import { useState } from "react";
import { createBanner } from "../serverActions";
import R2Upload from "@/components/R2Upload";
import PageHeader from "@/components/public/ui/PageHeader";

export default function BannerNewForm() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="p-6 max-w-[760px]">
      <PageHeader
        title="Create Banner"
        subtitle="Create a new popup banner."
      />

      <form action={createBanner} className="mt-[18px] grid gap-3">

        <select name="type">
          <option value="TEXT">Text Banner</option>
          <option value="IMAGE_ONLY">Image Only</option>
        </select>

        <input name="title" placeholder="Banner title" />
        <textarea name="message" placeholder="Banner message" rows={3} />

        <input type="hidden" name="imageUrl" value={imageUrl} />

        <div>
          <p className="font-semibold mb-2">Banner Image</p>
          <R2Upload folder="banners" onUploaded={setImageUrl} />
        </div>

        <input name="buttonText" placeholder="Button text" />
        <input name="buttonLink" placeholder="Button link" />

        <label className="flex gap-2 items-center">
          <input type="checkbox" name="isActive" />
          Active
        </label>

        <input type="datetime-local" name="startAt" />
        <input type="datetime-local" name="endAt" />

        <button type="submit">Create Banner</button>
      </form>
    </div>
  );
}