"use client";

import Link from "next/link";
import { useState } from "react";
import { createBlog } from "../serverActions";
import BlogImageField from "@/components/admin/BlogImagesField";
import PageHeader from "@/components/public/ui/PageHeader";

export default function BlogNewForm() {
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  return (
    <div className="p-6 max-w-[760px]">
      <PageHeader 
        title="Add Blog" 
        subtitle="Create a new blog post." 
      />

      <form
        action={createBlog}
        className="mt-[18px] grid gap-3"
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
        <h3 className="font-heading text-xl font-semibold">SEO Settings</h3>

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
        <h3 className="font-heading text-xl font-semibold">Blog Details</h3>

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

        <label className="flex items-center gap-2">
          <input name="published" type="checkbox" />
          Published
        </label>

        <div className="flex gap-[10px]">
          <button type="submit">Create</button>
          <Link href="/admin/blogs">Cancel</Link>
        </div>
      </form>
    </div>
  );
}