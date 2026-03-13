"use client";

import { useState } from "react";
import R2Upload from "@/components/R2Upload";
import PageHeader from "@/components/public/ui/PageHeader";

import { updateBanner } from "../../serverActions";

export default function BannerEditForm({
  banner,
}: {
  banner: any;
}) {
  const [imageUrl, setImageUrl] = useState(banner.imageUrl ?? "");

  return (
    <div className="max-w-[760px]">

      <PageHeader title="Edit Banner" />

      <form
        action={updateBanner}
        className="mt-[18px] grid gap-3"
      >
        <input type="hidden" name="id" value={banner.id} />

        {/* Banner Type */}
        <select name="type" defaultValue={banner.type}>
          <option value="TEXT">Text Banner</option>
          <option value="IMAGE_ONLY">Image Only</option>
        </select>

        {/* Text Content */}
        <input
          name="title"
          defaultValue={banner.title ?? ""}
          placeholder="Banner title"
        />

        <textarea
          name="message"
          defaultValue={banner.message ?? ""}
          rows={3}
          placeholder="Banner message"
        />

        {/* Image Upload */}
        <input type="hidden" name="imageUrl" value={imageUrl} />

        <div>
          <p className="font-semibold mb-2">Banner Image</p>

          <R2Upload folder="banners" onUploaded={setImageUrl} />

          {imageUrl ? (
            <a
              href={imageUrl}
              target="_blank"
              className="text-xs"
            >
              View current image
            </a>
          ) : (
            <p className="text-xs opacity-70">
              No image uploaded
            </p>
          )}
        </div>

        {/* CTA */}
        <input
          name="buttonText"
          defaultValue={banner.buttonText ?? ""}
          placeholder="Button text"
        />

        <input
          name="buttonLink"
          defaultValue={banner.buttonLink ?? ""}
          placeholder="Button link"
        />

        {/* Scheduling */}
        <input
          type="datetime-local"
          name="startAt"
          defaultValue={
            banner.startAt
              ? new Date(banner.startAt)
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
        />

        <input
          type="datetime-local"
          name="endAt"
          defaultValue={
            banner.endAt
              ? new Date(banner.endAt)
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
        />

        {/* Active toggle */}
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={banner.isActive}
          />
          Active
        </label>

        <button type="submit">Save Changes</button>

      </form>

    </div>
  );
}