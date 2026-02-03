"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createBlogService,
  updateBlogService,
  deleteBlogService,
  toggleBlogPublishedService,
} from "@/lib/services/blogService";

export const createBlog = secureAdminAction(
  async (admin, formData: FormData) => {
    await createBlogService(formData, admin.id);

    revalidatePath("/blogs");
    revalidatePath("/sitemap.xml");

    redirect("/admin/blogs");
  }
);

export const updateBlog = secureAdminAction(
  async (admin, formData: FormData) => {
    await updateBlogService(formData, admin.id);

    revalidatePath("/blogs");
    revalidatePath("/sitemap.xml");

    redirect("/admin/blogs");
  }
);

export const deleteBlog = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    await deleteBlogService(id, admin.id);

    revalidatePath("/blogs");
    revalidatePath("/sitemap.xml");

    redirect("/admin/blogs");
  }
);

export const toggleBlogPublished = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");
    const published = String(formData.get("published")) === "true";

    await toggleBlogPublishedService(id, published, admin.id);

    revalidatePath("/blogs");
    revalidatePath("/sitemap.xml");

    redirect("/admin/blogs");
  }
);
