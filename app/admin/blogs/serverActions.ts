"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createBlog(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const description = String(formData.get("description") ?? "");
  const content = String(formData.get("content") ?? "");
  const published = formData.get("published") === "on";

  await prisma.blog.create({
    data: {
      title,
      slug,
      description,
      content,
      published,
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

  await prisma.blog.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      content,
      published,
    },
  });

  redirect("/admin/blogs");
}

export async function deleteBlog(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  await prisma.blog.delete({
    where: { id },
  });

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
