"use server";

import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/storage/r2/delete";

export async function createBlog(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const description = String(formData.get("description") ?? "");
  const content = String(formData.get("content") ?? "");
  const published = formData.get("published") === "on";

  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "");

  await prisma.blog.create({
    data: {
      title,
      slug,
      description,        // ✅ always string
      content,            // ✅ always string (no null)
      published,
      thumbnailUrl: thumbnailUrl || null,
    },
  });

  redirect("/admin/blogs");
}

export async function updateBlog(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const description = String(formData.get("description") ?? "");
  const content = String(formData.get("content") ?? "");
  const published = formData.get("published") === "on";

  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "");
  const oldThumbnailUrl = String(formData.get("oldThumbnailUrl") ?? "");

  await prisma.blog.update({
    where: { id },
    data: {
      title,
      slug,
      description,        // ✅ always string
      content,            // ✅ always string
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

  redirect("/admin/blogs");
}

export async function deleteBlog(formData: FormData) {
  const id = String(formData.get("id") ?? "");

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

  redirect("/admin/blogs");
}

export async function toggleBlogPublished(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "false") === "true";

  await prisma.blog.update({
    where: { id },
    data: { published: !published },
  });

  redirect("/admin/blogs");
}
