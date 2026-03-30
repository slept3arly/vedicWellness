"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { updateBlog } from "../../serverActions";
import BlogImageField from "@/components/admin/BlogImagesField";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { toast } from "@/lib/toast";

/* ── shared class strings ── */

const inputCls =
  "w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const textareaCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const labelCls =
  "block mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

/* ── primitives ── */

function F({ id, lbl, tip, req, children }: {
  id?: string; lbl: string; tip?: string; req?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="w-full text-left">
      <label htmlFor={id} className={labelCls}>
        {lbl}{req && <span className="ml-0.5 text-destructive" aria-hidden>*</span>}
      </label>
      {children}
      {tip && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 opacity-80">{tip}</p>}
    </div>
  );
}

function Sec({ title, sub, children }: {
  title: string; sub?: string; children: React.ReactNode;
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

export default function BlogEditForm({ blog }: { blog: any }) {
  const [isPending, start] = useTransition();
  const [thumbnailUrl, setThumbnailUrl] = useState(blog.thumbnailUrl ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    
    start(async () => {
      try {
        await updateBlog(data);
        toast.success("Blog updated successfully.");
      } catch (e: any) {
        if (e?.message === "NEXT_REDIRECT" || e?.digest?.startsWith("NEXT_REDIRECT")) return;
        toast.error("Failed to update blog", e?.message);
      }
    });
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 space-y-6">
      <form onSubmit={handleSubmit} noValidate aria-label="Edit blog" className="space-y-6">
        
        {/* Header: Strictly left-aligned with manual text for subtitle to avoid component centering */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex flex-col items-start text-left">
            <div className="[&_h1]:text-left [&_h1]:m-0">
               <PageHeader title="Edit Blog" />
            </div>
            <p className="text-sm text-muted-foreground/80 mt-1 text-left">
              Update your blog post details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <AdminButton 
              type="submit" 
              variant="success" 
              className="w-full sm:min-w-[140px]"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </AdminButton>
            
            <Link href="/admin/blogs" className="w-full sm:w-auto">
              <AdminButton type="button" variant="secondary" className="w-full">
                Cancel
              </AdminButton>
            </Link>
          </div>
        </div>

        {/* Hidden inputs for state */}
        <input type="hidden" name="id" value={blog.id} />
        <input type="hidden" name="oldThumbnailUrl" value={blog.thumbnailUrl ?? ""} />
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
        <input type="hidden" name="published" value="on" />

        <Sec title="Blog Details" sub="Basic information about the post.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <F id="title" lbl="Blog Title" req>
              <input id="title" name="title" defaultValue={blog.title} required className={inputCls} />
            </F>
            <F id="slug" lbl="Slug" req tip="URL-safe identifier">
              <input id="slug" name="slug" defaultValue={blog.slug} required pattern="[a-z0-9-]+" className={inputCls} />
            </F>
            <F id="author" lbl="Author">
              <input id="author" name="author" defaultValue={blog.author ?? ""} className={inputCls} />
            </F>
            <F id="category" lbl="Category">
              <input id="category" name="category" defaultValue={blog.category ?? ""} className={inputCls} />
            </F>
          </div>
          <F id="tags" lbl="Tags" tip="Comma separated">
            <input id="tags" name="tags" defaultValue={(blog.tags ?? []).join(", ")} className={inputCls} />
          </F>
        </Sec>

        <AdminCard>
          <div className="mb-4 text-left border-b border-border pb-4">
            <SectionHeading title="Featured Image" subtitle="The main thumbnail for this blog post." />
          </div>
          <BlogImageField
            thumbnailUrl={thumbnailUrl}
            setThumbnailUrl={setThumbnailUrl}
          />
        </AdminCard>

        <Sec title="Content" sub="The body of your post.">
          <div className="space-y-5">
            <F id="description" lbl="Short Description">
              <textarea id="description" name="description" defaultValue={blog.description ?? ""} rows={3} className={textareaCls} />
            </F>
            <F id="content" lbl="Main Content">
              <textarea id="content" name="content" defaultValue={blog.content ?? ""} rows={15} className={textareaCls} />
            </F>
          </div>
        </Sec>

        <Sec title="SEO Settings" sub="Optimize for search results.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <F id="metaTitle" lbl="Meta Title">
              <input id="metaTitle" name="metaTitle" defaultValue={blog.metaTitle ?? ""} className={inputCls} />
            </F>
            <F id="canonicalUrl" lbl="Canonical URL">
              <input id="canonicalUrl" name="canonicalUrl" defaultValue={blog.canonicalUrl ?? ""} className={inputCls} />
            </F>
          </div>
          <F id="metaDescription" lbl="Meta Description">
            <textarea id="metaDescription" name="metaDescription" defaultValue={blog.metaDescription ?? ""} rows={3} className={textareaCls} />
          </F>
        </Sec>
      </form>
    </div>
  );
}