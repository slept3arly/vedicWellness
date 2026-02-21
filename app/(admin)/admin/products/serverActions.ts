"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

import {
  createProductService,
  updateProductService,
  toggleProductPublishedService,
  deleteProductService,
} from "@/lib/services/productService";

const PRODUCT_TAG = "products";

export const createProduct = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = await createProductService(formData, admin.id);

    revalidateTag(PRODUCT_TAG, "max");

    redirect("/admin/products");
  }
);

export const updateProduct = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = await updateProductService(formData, admin.id);

    revalidateTag(PRODUCT_TAG, "max");

    redirect("/admin/products");
  }
);

export const toggleProductPublished = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");
    const published = String(formData.get("published")) === "true";

    await toggleProductPublishedService(id, published, admin.id);

    revalidateTag(PRODUCT_TAG, "max");
  }
);

export const deleteProduct = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    await deleteProductService(id, admin.id);

    revalidateTag(PRODUCT_TAG, "max");
  }
);