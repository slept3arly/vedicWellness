"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name"));
  const slug = String(formData.get("slug"));

  const description = String(formData.get("description") || "");
  const imageUrl = String(formData.get("imageUrl") || "");
  const priceRaw = String(formData.get("price") || "");
  const published = formData.get("published") === "on";

  const price = priceRaw ? Number(priceRaw) : null;

  await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      imageUrl: imageUrl || null,
      price,
      published,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const slug = String(formData.get("slug"));

  const description = String(formData.get("description") || "");
  const imageUrl = String(formData.get("imageUrl") || "");
  const priceRaw = String(formData.get("price") || "");
  const published = formData.get("published") === "on";

  const price = priceRaw ? Number(priceRaw) : null;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || null,
      imageUrl: imageUrl || null,
      price,
      published,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function toggleProductPublished(formData: FormData) {
  const id = String(formData.get("id"));
  const published = String(formData.get("published")) === "true";

  await prisma.product.update({
    where: { id },
    data: { published: !published },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id"));

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
