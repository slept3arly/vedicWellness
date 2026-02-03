"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createProductService,
  updateProductService,
  toggleProductPublishedService,
  deleteProductService,
} from "@/lib/services/productService";

export const createProduct = secureAdminAction(
  async (admin, formData: FormData) => {
    await createProductService(formData, admin.id);

    revalidatePath("/admin/products");
    revalidatePath("/products");

    redirect("/admin/products");
  }
);

export const updateProduct = secureAdminAction(
  async (admin, formData: FormData) => {
    await updateProductService(formData, admin.id);

    revalidatePath("/admin/products");
    revalidatePath("/products");

    redirect("/admin/products");
  }
);

export const toggleProductPublished = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");
    const published = String(formData.get("published")) === "true";

    await toggleProductPublishedService(id, published, admin.id);

    revalidatePath("/admin/products");
    revalidatePath("/products");
  }
);

export const deleteProduct = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    await deleteProductService(id, admin.id);

    revalidatePath("/admin/products");
    revalidatePath("/products");
  }
);
