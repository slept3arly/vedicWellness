"use server";

import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache"; // ✅ ADD

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/storage/r2/delete";
import { assertSameOriginAction } from "@/lib/security/csrf";
import { auditLog } from "@/lib/observability/audit";

async function getRequestContext() {
  const h = await headers();
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: h.get("user-agent") ?? null,
  };
}

export async function createBlog(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "").trim();

  const metaTitle = String(formData.get("metaTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  const canonicalUrl = String(formData.get("canonicalUrl") ?? "").trim();

  const author = String(formData.get("author") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const published = formData.get("published") === "on";
  const publishedAt = published ? new Date() : null;

  const blog = await prisma.blog.create({
    data: {
      title,
      slug,
      description: description || null,
      content: content || null,
      thumbnailUrl: thumbnailUrl || null,

      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      canonicalUrl: canonicalUrl || null,

      author: author || "Vedic Wellness Team",
      category: category || null,
      tags,

      published,
      publishedAt,
    },
    select: { id: true },
  });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_CREATE",
    entityType: "BLOG",
    entityId: blog.id,
    ip,
    userAgent,
    metadata: { title, slug, published },
  });

  // ✅ Revalidate public pages only when needed
  revalidatePath("/blogs");
  revalidatePath("/sitemap.xml");

  redirect("/admin/blogs");
}

export async function updateBlog(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();

  const description = String(formData.get("description") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "").trim();
  const oldThumbnailUrl = String(formData.get("oldThumbnailUrl") ?? "").trim();

  const metaTitle = String(formData.get("metaTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  const canonicalUrl = String(formData.get("canonicalUrl") ?? "").trim();

  const author = String(formData.get("author") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const published = formData.get("published") === "on";

  const current = await prisma.blog.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  const publishedAt =
    published && !current?.publishedAt ? new Date() : current?.publishedAt;

  await prisma.blog.update({
    where: { id },
    data: {
      title,
      slug,
      description: description || null,
      content: content || null,

      thumbnailUrl: thumbnailUrl || null,

      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      canonicalUrl: canonicalUrl || null,

      author: author || "Vedic Wellness Team",
      category: category || null,
      tags,

      published,
      publishedAt: published ? publishedAt : null,
    },
  });

  if (oldThumbnailUrl && thumbnailUrl && oldThumbnailUrl !== thumbnailUrl) {
    const key = getR2KeyFromPublicUrl(oldThumbnailUrl);
    if (key) {
      try {
        await deleteFromR2(key);
      } catch (e) {
        console.error("Failed to delete old blog thumbnail from R2:", e);
      }
    }
  }

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_UPDATE",
    entityType: "BLOG",
    entityId: id,
    ip,
    userAgent,
    metadata: {
      title,
      slug,
      published,
      thumbnailChanged: oldThumbnailUrl !== thumbnailUrl,
    },
  });

  // ✅ Revalidate listing + details + sitemap
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${slug}`);
  revalidatePath("/sitemap.xml");

  redirect("/admin/blogs");
}

export async function deleteBlog(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  const blog = await prisma.blog.findUnique({
    where: { id },
    select: { title: true, slug: true, thumbnailUrl: true },
  });

  await prisma.blog.delete({ where: { id } });

  if (blog?.thumbnailUrl) {
    const key = getR2KeyFromPublicUrl(blog.thumbnailUrl);
    if (key) {
      try {
        await deleteFromR2(key);
      } catch (e) {
        console.error("Failed to delete blog thumbnail from R2:", e);
      }
    }
  }

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_DELETE",
    entityType: "BLOG",
    entityId: id,
    ip,
    userAgent,
    metadata: {
      title: blog?.title ?? null,
      slug: blog?.slug ?? null,
      hadThumbnail: Boolean(blog?.thumbnailUrl),
    },
  });

  // ✅ refresh listing + sitemap
  revalidatePath("/blogs");
  revalidatePath("/sitemap.xml");

  redirect("/admin/blogs");
}

export async function toggleBlogPublished(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const published = String(formData.get("published") ?? "false") === "true";

  const blog = await prisma.blog.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.blog.update({
    where: { id },
    data: { published: !published },
  });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: !published ? "ADMIN_PUBLISH" : "ADMIN_UNPUBLISH",
    entityType: "BLOG",
    entityId: id,
    ip,
    userAgent,
    metadata: { from: published, to: !published },
  });

  // ✅ refresh listing + details + sitemap
  revalidatePath("/blogs");
  if (blog?.slug) revalidatePath(`/blogs/${blog.slug}`);
  revalidatePath("/sitemap.xml");

  redirect("/admin/blogs");
}
