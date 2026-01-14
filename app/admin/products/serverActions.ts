"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/r2-delete";

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
  const oldImageUrl = String(formData.get("oldImageUrl") || "");

  const priceRaw = String(formData.get("price") || "");
  const published = formData.get("published") === "on";
  const price = priceRaw ? Number(priceRaw) : null;

  // ✅ Update DB first
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

  // ✅ Delete old image ONLY if changed and old exists and is from R2
  if (oldImageUrl && imageUrl && oldImageUrl !== imageUrl) {
    const key = getR2KeyFromPublicUrl(oldImageUrl);
    if (key) {
      try {
        await deleteFromR2(key);
      } catch (e) {
        console.error("Failed to delete old image from R2:", e);
        // not throwing because product update should succeed even if delete fails
      }
    }
  }

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

  // ✅ get product first so we can delete image from R2
  const product = await prisma.product.findUnique({ where: { id } });

  await prisma.product.delete({ where: { id } });

  // ✅ delete image in R2 too
  if (product?.imageUrl) {
    const key = getR2KeyFromPublicUrl(product.imageUrl);
    if (key) {
      try {
        await deleteFromR2(key);
      } catch (e) {
        console.error("Failed to delete product image from R2:", e);
      }
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
