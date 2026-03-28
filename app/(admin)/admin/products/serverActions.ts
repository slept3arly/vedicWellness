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

import {
  parseProductForm,
  ProductVariantsSchema,
} from "@/lib/validators/product";

const PRODUCT_TAG = "products";

/* =========================================================
   CREATE
========================================================= */

export const createProduct = secureAdminAction(
  async (admin, formData: FormData) => {
    const data = parseProductForm(formData);

    const id = await createProductService(data, admin.id);

    revalidateTag(PRODUCT_TAG, "max");

    redirect("/admin/products");
  }
);

/* =========================================================
   UPDATE
========================================================= */

export const updateProduct = secureAdminAction(
  async (admin, formData: FormData) => {
    const data = parseProductForm(formData);

    /* ---------------- VARIANTS PARSE ---------------- */

    let variantsRaw: unknown = [];
    const variantsJson = formData.get("variantsJson");

    if (variantsJson) {
      try {
        variantsRaw = JSON.parse(String(variantsJson));
      } catch {
        variantsRaw = [];
      }
    }

    const variants = ProductVariantsSchema.parse(
      Array.isArray(variantsRaw)
        ? variantsRaw.map((v: any) => ({
            name: String(v.name ?? "").trim(),
            price: Number(v.price),
            compareAtPrice:
              v.compareAtPrice && Number(v.compareAtPrice) > 0
                ? Number(v.compareAtPrice)
                : null,
            stock: Number(v.stock ?? 0),
            sku: v.sku ? String(v.sku).trim() : null,
          }))
        : []
    );

    const id = await updateProductService(data, variants, admin.id);

    revalidateTag(PRODUCT_TAG, "max");

    if (data.slug) {
      revalidateTag(`product:${data.slug}`, "max");
    }

    redirect("/admin/products");
  }
);

/* =========================================================
   TOGGLE PUBLISHED
========================================================= */

export const toggleProductPublished = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");
    const published = String(formData.get("published")) === "true";

    await toggleProductPublishedService(id, published, admin.id);

    revalidateTag(PRODUCT_TAG, "max");
  }
);

/* =========================================================
   DELETE
========================================================= */

export const deleteProduct = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    await deleteProductService(id, admin.id);

    revalidateTag(PRODUCT_TAG, "max");
  }
);

/* =========================================================
   ❌ REMOVED (IMPORTANT)
========================================================= */

// DO NOT add getAdminProductsAction here
// Admin pages must call DB directly