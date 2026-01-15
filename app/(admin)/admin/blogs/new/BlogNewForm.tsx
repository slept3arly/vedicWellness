"use client";

import Link from "next/link";
import { useState } from "react";
import { createBlog } from "../serverActions";
import R2Upload from "@/components/R2Upload";

export default function BlogNewForm() {
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  return (
    <div style={{ padding: 24, maxWidth: 760 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Add Blog</h1>
      <p style={{ opacity: 0.7 }}>Create a new blog post.</p>

      <form
        action={createBlog}
        style={{ marginTop: 18, display: "grid", gap: 12 }}
      >
        <input name="title" placeholder="Blog title" required />
        <input name="slug" placeholder="Slug (example: why-hair-oil)" required />

        {/* ✅ Hidden input: thumbnailUrl goes to server action */}
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />

        <div>
          <p style={{ marginBottom: 8, fontWeight: 600 }}>Thumbnail Image</p>
          <R2Upload folder="blogs" onUploaded={setThumbnailUrl} />
          {thumbnailUrl ? (
            <a href={thumbnailUrl} target="_blank" style={{ fontSize: 12 }}>
              View uploaded thumbnail
            </a>
          ) : (
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              (Optional) Upload thumbnail for blog list card.
            </p>
          )}
        </div>

        <textarea
          name="description"
          placeholder="Short description (shown in list + SEO)"
          rows={3}
        />

        <textarea
          name="content"
          placeholder="Blog content (HTML/Markdown/plain text)"
          rows={12}
        />

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input name="published" type="checkbox" defaultChecked />
          Published
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">Create</button>
          <Link href="/admin/blogs">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
