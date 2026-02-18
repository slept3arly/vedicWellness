"use client";

import Link from "next/link";
import { useState } from "react";
import { createBlog } from "../serverActions";
import BlogImageField from "@/components/admin/BlogImagesField";

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

        {/* Thumbnail */}
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
        <BlogImageField
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
        />

        <hr />
        <h3 style={{ fontWeight: 700 }}>SEO Settings</h3>

        <input
          name="metaTitle"
          placeholder="Meta Title (optional, defaults to Blog Title)"
        />

        <textarea
          name="metaDescription"
          placeholder="Meta Description (recommended)"
          rows={3}
        />

        <input
          name="canonicalUrl"
          placeholder="Canonical URL (optional)"
        />

        <hr />
        <h3 style={{ fontWeight: 700 }}>Blog Details</h3>

        <input
          name="author"
          placeholder="Author (default: Vedic Wellness Team)"
        />

        <input
          name="category"
          placeholder="Category (example: Ayurveda / Franchise / Business)"
        />

        <input
          name="tags"
          placeholder="Tags (comma separated)"
        />

        <textarea
          name="description"
          placeholder="Short description (shown in list + SEO)"
          rows={3}
        />

        <textarea
          name="content"
          placeholder="Blog content"
          rows={12}
        />

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input name="published" type="checkbox" />
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
