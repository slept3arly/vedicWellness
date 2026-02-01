"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { assertSameOriginAction } from "@/lib/security/csrf";

import {
  createProductService,
  updateProductService,
  toggleProductPublishedService,
  deleteProductService,
} from "@/lib/services/productService";

export async function createProduct(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  await createProductService(formData, admin.id);

  revalidatePath("/admin/products");
  revalidatePath("/products");

  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  await updateProductService(formData, admin.id);

  revalidatePath("/admin/products");
  revalidatePath("/products");

  redirect("/admin/products");
}

export async function toggleProductPublished(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published")) === "true";

  await toggleProductPublishedService(id, published, admin.id);

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteProduct(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");

  await deleteProductService(id, admin.id);

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
