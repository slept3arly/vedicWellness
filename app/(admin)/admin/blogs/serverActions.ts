"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createBlogService,
  updateBlogService,
  deleteBlogService,
  toggleBlogPublishedService,
} from "@/lib/services/admin/blogService";

import { parseBlogForm } from "@/lib/validators/blog";

import { CACHE_TAGS } from "@/lib/constants";

/* ========================================================= */
/* CREATE */
/* ========================================================= */

export const createBlog = secureAdminAction(
  async (admin, formData: FormData) => {
    const data = parseBlogForm(formData);

    await createBlogService(data, admin.id);

    revalidateTag(CACHE_TAGS.BLOGS, "max");

    redirect("/admin/blogs");
  }
);

/* ========================================================= */
/* UPDATE */
/* ========================================================= */

export const updateBlog = secureAdminAction(
  async (admin, formData: FormData) => {
    const data = parseBlogForm(formData);

    await updateBlogService(data, admin.id);

    revalidateTag(CACHE_TAGS.BLOGS, "max");
    revalidateTag(`blog:${data.slug}`, "max");

    redirect("/admin/blogs");
  }
);

/* ========================================================= */
/* DELETE */
/* ========================================================= */

export const deleteBlog = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    await deleteBlogService(id, admin.id);

    revalidateTag(CACHE_TAGS.BLOGS, "max");

    redirect("/admin/blogs");
  }
);

/* ========================================================= */
/* TOGGLE PUBLISH */
/* ========================================================= */

export const toggleBlogPublished = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");
    const published = String(formData.get("published")) === "true";

    await toggleBlogPublishedService(id, published, admin.id);

    revalidateTag(CACHE_TAGS.BLOGS, "max");

    redirect("/admin/blogs");
  }
);