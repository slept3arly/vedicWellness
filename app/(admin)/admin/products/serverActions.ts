"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/storage/r2/delete";
import { assertSameOriginAction } from "@/lib/security/csrf";
import { auditLog } from "@/lib/observability/audit";

async function getRequestContext() {
  const h = await headers();
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: h.get("user-agent") ?? null,
  };
}

export async function createProduct(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();

  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const priceRaw = String(formData.get("price") || "").trim();
  const published = formData.get("published") === "on";

  const price = priceRaw ? Number(priceRaw) : null;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      imageUrl: imageUrl || null,
      price,
      published,
    },
    select: { id: true },
  });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_CREATE",
    entityType: "OTHER",
    entityId: product.id,
    ip,
    userAgent,
    metadata: { kind: "PRODUCT", name, slug, published, price, imageUrl: imageUrl || null },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();

  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const oldImageUrl = String(formData.get("oldImageUrl") || "").trim();

  const priceRaw = String(formData.get("price") || "").trim();
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

  // ✅ Delete old image ONLY if changed and old exists and is from R2
  if (oldImageUrl && imageUrl && oldImageUrl !== imageUrl) {
    const key = getR2KeyFromPublicUrl(oldImageUrl);
    if (key) {
      try {
        await deleteFromR2(key);
      } catch (e) {
        console.error("Failed to delete old image from R2:", e);
      }
    }
  }

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_UPDATE",
    entityType: "OTHER",
    entityId: id,
    ip,
    userAgent,
    metadata: {
      kind: "PRODUCT",
      name,
      slug,
      published,
      price,
      imageChanged: oldImageUrl !== imageUrl,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function toggleProductPublished(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const published = String(formData.get("published") ?? "false") === "true";

  await prisma.product.update({
    where: { id },
    data: { published: !published },
  });

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: !published ? "ADMIN_PUBLISH" : "ADMIN_UNPUBLISH",
    entityType: "OTHER",
    entityId: id,
    ip,
    userAgent,
    metadata: { kind: "PRODUCT", from: published, to: !published },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteProduct(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

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

  const { ip, userAgent } = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_DELETE",
    entityType: "OTHER",
    entityId: id,
    ip,
    userAgent,
    metadata: {
      kind: "PRODUCT",
      name: product?.name ?? null,
      slug: product?.slug ?? null,
      hadImage: Boolean(product?.imageUrl),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
