"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { assertSameOriginAction } from "@/lib/security/csrf";

import {
  createBlogService,
  updateBlogService,
  deleteBlogService,
  toggleBlogPublishedService,
} from "@/lib/services/blogService";

export async function createBlog(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  await createBlogService(formData, admin.id);

  revalidatePath("/blogs");
  revalidatePath("/sitemap.xml");

  redirect("/admin/blogs");
}

export async function updateBlog(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  await updateBlogService(formData, admin.id);

  revalidatePath("/blogs");
  revalidatePath("/sitemap.xml");

  redirect("/admin/blogs");
}

export async function deleteBlog(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");

  await deleteBlogService(id, admin.id);

  revalidatePath("/blogs");
  revalidatePath("/sitemap.xml");

  redirect("/admin/blogs");
}

export async function toggleBlogPublished(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published")) === "true";

  await toggleBlogPublishedService(id, published, admin.id);

  revalidatePath("/blogs");
  revalidatePath("/sitemap.xml");

  redirect("/admin/blogs");
}
