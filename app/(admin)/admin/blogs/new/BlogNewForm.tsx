"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { createBlog } from "../serverActions";
import BlogImageField from "@/components/admin/BlogImagesField";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { toast } from "@/lib/toast";

/* ── shared class strings ── */

const inputCls =
  "w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const textareaCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring";

const labelCls =
  "block mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

/* ── primitives ── */

function F({
  id,
  lbl,
  tip,
  req,
  children,
}: {
  id?: string;
  lbl: string;
  tip?: string;
  req?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <label htmlFor={id} className={labelCls}>
        {lbl}
        {req && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {tip && (
        <p className="mt-1 text-xs text-neutral-500 opacity-80">{tip}</p>
      )}
    </div>
  );
}

function Sec({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <AdminCard>
      <div className="mb-5 pb-4 border-b border-border text-left">
        <SectionHeading title={title} subtitle={sub} />
      </div>
      <div className="space-y-5">{children}</div>
    </AdminCard>
  );
}

/* ── main ── */

export default function BlogNewForm() {
  const [isPending, start] = useTransition();
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    start(async () => {
      try {
        await createBlog(data);
        toast.success("Blog post created successfully.");
      } catch (e: unknown) { const error = e as { message?: string; digest?: string };
        if (
          error?.message === "NEXT_REDIRECT" ||
          error?.digest?.startsWith("NEXT_REDIRECT")
        )
          return;
        toast.error("Failed to create blog", error?.message);
      }
    });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-0 sm:px-4 pb-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* HEADER — matches working page */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
          <PageHeader
            title="Add Blog"
            subtitle="Create a new blog post."
            align="left"
            className="max-w-none m-0 p-0"
          />

          <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
              
              <Link href="/admin/blogs" className="w-full lg:w-auto">
                <AdminButton
                  variant="secondary"
                  className="w-full sm:min-w-[120px]"
                >
                  Discard
                </AdminButton>
              </Link>

              <AdminButton
                type="submit"
                variant="success"
                className="w-full sm:min-w-[160px]"
                disabled={isPending}
              >
                {isPending ? "Creating…" : "Create Blog"}
              </AdminButton>

            </div>
          </div>
        </div>

        {/* hidden fields */}
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
        <input type="hidden" name="published" value="on" />

        {/* BLOG DETAILS */}
        <Sec title="Blog Details" sub="Basic information about the post.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            <F id="title" lbl="Blog Title" req>
              <input
                id="title"
                name="title"
                placeholder="Why Hair Oil is Essential"
                required
                className={inputCls}
              />
            </F>

            <F id="slug" lbl="Slug" req tip="URL-safe identifier">
              <input
                id="slug"
                name="slug"
                placeholder="why-hair-oil"
                required
                pattern="[a-z0-9-]+"
                className={inputCls}
              />
            </F>

            <F id="author" lbl="Author">
              <input
                id="author"
                name="author"
                placeholder="Vedic Wellness Team"
                className={inputCls}
              />
            </F>

            <F id="category" lbl="Category">
              <input
                id="category"
                name="category"
                placeholder="Ayurveda"
                className={inputCls}
              />
            </F>

          </div>

          <F id="tags" lbl="Tags" tip="Comma separated">
            <input
              id="tags"
              name="tags"
              placeholder="wellness, organic, lifestyle"
              className={inputCls}
            />
          </F>
        </Sec>

        {/* IMAGE */}
        <AdminCard>
          <div className="mb-4">
            <SectionHeading
              title="Featured Image"
              subtitle="Thumbnail for blog cards and SEO."
            />
          </div>
          <BlogImageField
            thumbnailUrl={thumbnailUrl}
            setThumbnailUrl={setThumbnailUrl}
          />
        </AdminCard>

        {/* CONTENT */}
        <Sec title="Content" sub="The body of your post.">
          <F id="description" lbl="Short Description">
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="A brief summary..."
              className={textareaCls}
            />
          </F>

          <F id="content" lbl="Main Content">
            <textarea
              id="content"
              name="content"
              rows={12}
              placeholder="Write your content..."
              className={textareaCls}
            />
          </F>
        </Sec>

        {/* SEO */}
        <Sec title="SEO Settings" sub="Optimize for search engines.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            <F id="metaTitle" lbl="Meta Title">
              <input
                id="metaTitle"
                name="metaTitle"
                placeholder="SEO Title"
                className={inputCls}
              />
            </F>

            <F id="canonicalUrl" lbl="Canonical URL">
              <input
                id="canonicalUrl"
                name="canonicalUrl"
                placeholder="https://..."
                className={inputCls}
              />
            </F>

          </div>

          <F id="metaDescription" lbl="Meta Description">
            <textarea
              id="metaDescription"
              name="metaDescription"
              rows={3}
              placeholder="SEO snippet..."
              className={textareaCls}
            />
          </F>
        </Sec>

      </form>
    </div>
  );
}