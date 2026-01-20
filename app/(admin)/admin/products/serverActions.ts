"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/storage/r2/delete";
import { assertSameOriginAction } from "@/lib/security/csrf";
import { auditLog } from "@/lib/observability/audit";

// -----------------------------
// helpers
// -----------------------------
async function getRequestContext() {
  const h = await headers();
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: h.get("user-agent") ?? null,
  };
}

function s(v: unknown) {
  return String(v ?? "").trim();
}

function nullable(v: unknown) {
  const x = s(v);
  return x.length ? x : null;
}

function hasAtLeastOneLetter(name: string) {
  return /[a-zA-Z]/.test(name);
}

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function parseIntRequired(v: unknown, field: string) {
  const raw = s(v);
  if (!raw) throw new Error(`${field} is required.`);
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${field} must be a valid number.`);
  return Math.floor(n);
}

function parseLinesArray(v: unknown): Prisma.InputJsonValue {
  const raw = s(v);
  if (!raw) return [];
  const items = raw
    .split(/\r?\n/g)
    .map((x) => x.trim())
    .filter(Boolean);
  return items as unknown as Prisma.InputJsonValue;
}

function parsePackaging(v: unknown): Prisma.InputJsonValue {
  // We store packaging as array of lines to keep it simple and flexible
  return parseLinesArray(v);
}

// -----------------------------
// actions
// -----------------------------
export async function createProduct(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const name = s(formData.get("name"));
  const slugRaw = s(formData.get("slug"));
  const slug = slugify(slugRaw);

  if (!slug) {
    throw new Error("Slug is required.");
  }


  if (!name || !hasAtLeastOneLetter(name)) {
    throw new Error("Product name must contain at least 1 letter.");
  }

  if (!slug || !isValidSlug(slug)) {
    throw new Error("Slug must be lowercase and contain only a-z, 0-9 and hyphens.");
  }

  // ✅ price required
  const price = parseIntRequired(formData.get("price"), "Selling price");

  const tag = nullable(formData.get("tag"));
  const shortDescription = nullable(formData.get("shortDescription"));

  const imageUrl = nullable(formData.get("imageUrl"));
  const gallery = parseLinesArray(formData.get("gallery"));

  const medicineForm = nullable(formData.get("medicineForm")) as any;

  const packaging = parsePackaging(formData.get("packagingText"));

  const indications = parseLinesArray(formData.get("indications"));
  const ingredients = parseLinesArray(formData.get("ingredients"));
  const directionsToUse = parseLinesArray(formData.get("directionsToUse"));
  const contraindications = parseLinesArray(formData.get("contraindications"));

  const published = formData.get("published") === "on";

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      tag,
      price,
      shortDescription,

      imageUrl,
      gallery,

      medicineForm,
      packaging,

      indications,
      ingredients,
      directionsToUse,
      contraindications,

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
    metadata: {
      kind: "PRODUCT",
      name,
      slug,
      published,
      price,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = s(formData.get("id"));

  const name = s(formData.get("name"));
  const slugRaw = s(formData.get("slug"));
const slug = slugify(slugRaw);

if (!slug) {
  throw new Error("Slug is required.");
}


  if (!name || !hasAtLeastOneLetter(name)) {
    throw new Error("Product name must contain at least 1 letter.");
  }

  if (!slug || !isValidSlug(slug)) {
    throw new Error("Slug must be lowercase and contain only a-z, 0-9 and hyphens.");
  }

  // ✅ price required
  const price = parseIntRequired(formData.get("price"), "Selling price");

  const tag = nullable(formData.get("tag"));
  const shortDescription = nullable(formData.get("shortDescription"));

  const imageUrl = nullable(formData.get("imageUrl"));
  const oldImageUrl = s(formData.get("oldImageUrl"));

  const gallery = parseLinesArray(formData.get("gallery"));

  const medicineForm = nullable(formData.get("medicineForm")) as any;
  const packaging = parsePackaging(formData.get("packagingText"));

  const indications = parseLinesArray(formData.get("indications"));
  const ingredients = parseLinesArray(formData.get("ingredients"));
  const directionsToUse = parseLinesArray(formData.get("directionsToUse"));
  const contraindications = parseLinesArray(formData.get("contraindications"));

  const published = formData.get("published") === "on";

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      tag,
      price,
      shortDescription,

      imageUrl,
      gallery,

      medicineForm,
      packaging,

      indications,
      ingredients,
      directionsToUse,
      contraindications,

      published,
    },
  });

  // ✅ delete old cover image if changed
  if (oldImageUrl && imageUrl && oldImageUrl !== imageUrl) {
    const key = getR2KeyFromPublicUrl(oldImageUrl);
    if (key) {
      try {
        await deleteFromR2(key);
      } catch (e) {
        console.error("Failed to delete old cover image from R2:", e);
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
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-") // replace invalid chars w/ hyphen
    .replace(/-+/g, "-")         // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");    // trim hyphens
}

export async function toggleProductPublished(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = s(formData.get("id"));
  const published = s(formData.get("published")) === "true";

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

  const id = s(formData.get("id"));

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, name: true, slug: true, imageUrl: true, gallery: true },
  });

  await prisma.product.delete({ where: { id } });

  // delete cover image
  if (product?.imageUrl) {
    const key = getR2KeyFromPublicUrl(product.imageUrl);
    if (key) {
      try {
        await deleteFromR2(key);
      } catch (e) {
        console.error("Failed to delete cover image from R2:", e);
      }
    }
  }

  // delete gallery images too
  if (product?.gallery && Array.isArray(product.gallery)) {
    for (const url of product.gallery) {
      if (typeof url === "string") {
        const key = getR2KeyFromPublicUrl(url);
        if (key) {
          try {
            await deleteFromR2(key);
          } catch (e) {
            console.error("Failed to delete gallery image:", e);
          }
        }
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
      hadCover: Boolean(product?.imageUrl),
      galleryCount: Array.isArray(product?.gallery) ? product!.gallery.length : 0,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
