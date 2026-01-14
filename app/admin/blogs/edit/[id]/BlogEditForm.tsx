"use client";

import { useState } from "react";
import R2Upload from "@/components/R2Upload";
import { updateBlog } from "../../serverActions";

export default function BlogEditForm({ blog }: { blog: any }) {
  const [thumbnailUrl, setThumbnailUrl] = useState(blog.thumbnailUrl ?? "");

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Edit Blog</h1>

      <form
        action={updateBlog}
        style={{ marginTop: 18, display: "grid", gap: 12 }}
      >
        <input type="hidden" name="id" value={blog.id} />

        {/* ✅ for deleting old thumbnail */}
        <input
          type="hidden"
          name="oldThumbnailUrl"
          value={blog.thumbnailUrl ?? ""}
        />

        {/* ✅ actual current thumbnail submitted */}
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />

        <input name="title" defaultValue={blog.title} required />
        <input name="slug" defaultValue={blog.slug} required />

        <div>
          <p style={{ marginBottom: 8, fontWeight: 600 }}>Thumbnail Image</p>
          <R2Upload folder="blogs" onUploaded={setThumbnailUrl} />
          {thumbnailUrl ? (
            <a href={thumbnailUrl} target="_blank" style={{ fontSize: 12 }}>
              View current thumbnail
            </a>
          ) : (
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              No thumbnail uploaded.
            </p>
          )}
        </div>

        <textarea
          name="description"
          defaultValue={blog.description ?? ""}
          rows={3}
        />

        <textarea name="content" defaultValue={blog.content ?? ""} rows={12} />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            name="published"
            defaultChecked={blog.published}
          />
          Published (visible on website)
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
