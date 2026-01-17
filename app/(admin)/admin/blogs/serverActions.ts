"use server";

import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/storage/r2/delete";
import { assertSameOriginAction } from "@/lib/security/csrf";
import { auditLog } from "@/lib/observability/audit";

async function getRequestContext() {
  const h = await headers(); // ✅ NO await
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: h.get("user-agent") ?? null,
  };
}

export async function createBlog(formData: FormData) {
  // ✅ CSRF first
  await assertSameOriginAction();

  // ✅ Auth second (and capture admin id for audit)
  const admin = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const published = formData.get("published") === "on";
  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "").trim();

  const blog = await prisma.blog.create({
    data: {
      title,
      slug,
      description,
      content,
      published,
      thumbnailUrl: thumbnailUrl || null,
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
  const published = formData.get("published") === "on";

  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "").trim();
  const oldThumbnailUrl = String(formData.get("oldThumbnailUrl") ?? "").trim();

  await prisma.blog.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      content,
      published,
      thumbnailUrl: thumbnailUrl || null,
    },
  });

  // ✅ delete old thumbnail if changed
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

  redirect("/admin/blogs");
}

export async function deleteBlog(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  const blog = await prisma.blog.findUnique({ where: { id } });

  await prisma.blog.delete({
    where: { id },
  });

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

  redirect("/admin/blogs");
}

export async function toggleBlogPublished(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const published = String(formData.get("published") ?? "false") === "true";

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

  redirect("/admin/blogs");
}
