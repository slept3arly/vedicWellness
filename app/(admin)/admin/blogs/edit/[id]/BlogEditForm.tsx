"use client";

import { useState } from "react";
import R2Upload from "@/components/R2Upload";
import PageHeader from "@/components/public/ui/PageHeader";
import { updateBlog } from "../../serverActions";

export default function BlogEditForm({ blog }: { blog: any }) {
  const [thumbnailUrl, setThumbnailUrl] = useState(blog.thumbnailUrl ?? "");

  return (
    <div className="max-w-[760px]">
      <PageHeader title="Edit Blog" />

      <form
        action={updateBlog}
        className="mt-[18px] grid gap-3"
      >
        <input type="hidden" name="id" value={blog.id} />

        <input type="hidden" name="oldThumbnailUrl" value={blog.thumbnailUrl ?? ""} />
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />

        {/* Core */}
        <input name="title" defaultValue={blog.title} required />
        <input name="slug" defaultValue={blog.slug} required />

        {/* Thumbnail */}
        <div>
          <p className="mb-2 font-semibold">Thumbnail Image</p>
          <R2Upload folder="blogs" onUploaded={setThumbnailUrl} />
          {thumbnailUrl ? (
            <a href={thumbnailUrl} target="_blank" className="text-xs">
              View current thumbnail
            </a>
          ) : (
            <p className="text-xs opacity-70">No thumbnail uploaded.</p>
          )}
        </div>

        {/* SEO */}
        <hr />
        <h3 className="font-heading text-xl font-semibold">SEO Settings</h3>

        <input
          name="metaTitle"
          defaultValue={blog.metaTitle ?? ""}
          placeholder="Meta Title"
        />

        <textarea
          name="metaDescription"
          defaultValue={blog.metaDescription ?? ""}
          placeholder="Meta Description"
          rows={3}
        />

        <input
          name="canonicalUrl"
          defaultValue={blog.canonicalUrl ?? ""}
          placeholder="Canonical URL"
        />

        {/* Blog Meta */}
        <hr />
        <h3 className="font-heading text-xl font-semibold">Blog Details</h3>

        <input
          name="author"
          defaultValue={blog.author ?? ""}
          placeholder="Author"
        />

        <input
          name="category"
          defaultValue={blog.category ?? ""}
          placeholder="Category"
        />

        <input
          name="tags"
          defaultValue={(blog.tags ?? []).join(", ")}
          placeholder="Tags (comma separated)"
        />

        {/* Content */}
        <textarea name="description" defaultValue={blog.description ?? ""} rows={3} />
        <textarea name="content" defaultValue={blog.content ?? ""} rows={12} />

        {/* Publishing */}
        <label className="flex gap-2 items-center">
          <input type="checkbox" name="published" defaultChecked={blog.published} />
          Published (visible on website)
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}