import {
  createProductDB,
  updateProductDB,
  deleteProductDB,
  getProductById,
  getPublicProductsDB,
  getPublicProductBySlugDB,
  getPublicProductMetadataDB,
  getAllPublishedProductSlugs,
  getRelatedProductsDB,
} from "@/lib/db/product";

import { MedicineForm } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { unstable_cache } from "next/cache"; // ✅ FIXED

import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/storage/r2/delete";
import { auditWithContext } from "@/lib/observability/auditWithContext";
import { prisma } from "@/lib/db/prisma";
import { CACHE_TAGS } from "@/lib/constants";
import { ProductSchema, ProductVariantsSchema } from "@/lib/validators/product";
import { normalizePagination } from "@/lib/db/pagination";
import { normalizeQuery } from "@/lib/db/search";

type ProductFormData = z.infer<typeof ProductSchema>;
type ProductVariantData = z.infer<typeof ProductVariantsSchema>[number];

const PUBLIC_PAGE_SIZE = 10;

/* ------------------------------------------------------------------ */
/* Admin Services                                                     */
/* ------------------------------------------------------------------ */

export async function createProductService(data: ProductFormData, adminId: string) {
  const product = await createProductDB(data as Prisma.ProductUncheckedCreateInput);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "PRODUCTS", // ✅ FIXED
    entityId: product.id,
    entityLabel: `Product: ${data.name}`,
    metadata: {
      type: "CREATE",
      snapshot: {
        name: data.name,
        slug: data.slug,
        published: data.published,
        price: data.price,
      },
    },
  });

  return product.id;
}

export async function updateProductService(
  data: ProductFormData,
  variants: ProductVariantData[],
  adminId: string
) {
  if (!data.id) throw new Error("Missing product id");
  const productId = data.id;

  const current = await getProductById(productId);

  /* -------------------------------------------------- */
  /* Transaction: Update Product + Replace Variants     */
  /* -------------------------------------------------- */

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data,
    });

    await tx.productVariant.deleteMany({
      where: { productId },
    });

    if (variants.length > 0) {
      await tx.productVariant.createMany({
        data: variants.map((v) => ({
          productId,
          name: v.name,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          sku: v.sku,
        })),
      });
    }
  });

  /* -------------------------------------------------- */
  /* Image Cleanup                                      */
  /* -------------------------------------------------- */

  if (
    current?.imageUrl &&
    data.imageUrl &&
    current.imageUrl !== data.imageUrl
  ) {
    const key = getR2KeyFromPublicUrl(current.imageUrl);
    if (key) await deleteFromR2(key);
  }

  /* -------------------------------------------------- */
  /* Audit                                              */
  /* -------------------------------------------------- */

  const changes: { field: string; from: unknown; to: unknown }[] = [];

  if (current?.name !== data.name) {
    changes.push({ field: "name", from: current?.name, to: data.name });
  }

  if (current?.slug !== data.slug) {
    changes.push({ field: "slug", from: current?.slug, to: data.slug });
  }

  if (current?.published !== data.published) {
    changes.push({
      field: "published",
      from: current?.published,
      to: data.published,
    });
  }

  if (current?.price !== data.price) {
    changes.push({
      field: "price",
      from: current?.price,
      to: data.price,
    });
  }

  const currentVariantCount = 0;
  if (currentVariantCount !== variants.length) {
    changes.push({
      field: "variantsCount",
      from: currentVariantCount,
      to: variants.length,
    });
  }

  if (changes.length > 0) {
    await auditWithContext({
      actorId: adminId,
      action: "ADMIN_UPDATE",
      entityType: "PRODUCTS", // ✅ FIXED
      entityId: productId,
      entityLabel: `Product: ${data.name}`,
      metadata: {
        type: "UPDATE",
        changes,
      },
    });
  }

  return productId;
}

export async function toggleProductPublishedService(
  id: string,
  published: boolean,
  adminId: string
) {
  await updateProductDB(id, { published: !published });

  const product = await getProductById(id);

  await auditWithContext({
    actorId: adminId,
    action: !published ? "ADMIN_PUBLISH" : "ADMIN_UNPUBLISH",
    entityType: "PRODUCTS", // ✅ FIXED
    entityId: id,
    entityLabel: `Product: ${product?.name ?? "Unknown"}`,
    metadata: {
      type: "UPDATE",
      changes: [
        {
          field: "published",
          from: published,
          to: !published,
        },
      ],
    },
  });
}

export async function deleteProductService(id: string, adminId: string) {
  const product = await getProductById(id);

  await deleteProductDB(id);

  if (product?.imageUrl) {
    const key = getR2KeyFromPublicUrl(product.imageUrl);
    if (key) await deleteFromR2(key);
  }

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "PRODUCTS", // ✅ FIXED
    entityId: id,
    entityLabel: `Product: ${product?.name ?? "Unknown"}`,
    metadata: {
      type: "DELETE",
      snapshot: {
        name: product?.name ?? null,
        slug: product?.slug ?? null,
        price: product?.price ?? null,
        published: product?.published ?? null,
      },
    },
  });
}

/* ------------------------------------------------------------------ */
/* Public Services (UNCHANGED — already correct)                       */
/* ------------------------------------------------------------------ */

export const getPublicProductsService = async ({
  page = 1,
  query = "",
  sort = "name_asc",
  companySlug = "",
}: {
  page?: number;
  query?: string;
  sort?: string;
  companySlug?: string;
}) => {
  page = normalizePagination(page, PUBLIC_PAGE_SIZE, PUBLIC_PAGE_SIZE).page;
  query = normalizeQuery(query);
  return unstable_cache(
    async () => {
      const { total, products } = await getPublicProductsDB({ page, limit: PUBLIC_PAGE_SIZE, query, sort, companySlug });
      return { products, total, totalPages: Math.max(1, Math.ceil(total / PUBLIC_PAGE_SIZE)), pageSize: PUBLIC_PAGE_SIZE };
    },
    ["public-products-list", String(page), query, sort, companySlug],
    { tags: [CACHE_TAGS.PRODUCTS, CACHE_TAGS.GLOBAL], revalidate: false }
  )();
};

export const getPublicProductBySlugService = (slug: string) =>
  unstable_cache(
    async () => getPublicProductBySlugDB(slug),
    [`product-${slug}`],
    {
      tags: [`product:${slug}`, CACHE_TAGS.PRODUCTS, CACHE_TAGS.GLOBAL],
      revalidate: false,
    }
  )();

export const getPublicProductMetadataService = (slug: string) =>
  unstable_cache(
    async () => getPublicProductMetadataDB(slug),
    [`product-meta-${slug}`],
    { tags: [`product:${slug}`, CACHE_TAGS.PRODUCTS, CACHE_TAGS.GLOBAL] }
  )();

export async function getAllPublishedProductSlugsService() {
  return getAllPublishedProductSlugs();
}

export const getRelatedProductsService = (
  slug: string,
  currentId: string,
  tag?: string | null,
  medicineForm?: MedicineForm | null
) =>
  unstable_cache(
    async () => {
      return getRelatedProductsDB(currentId, tag, medicineForm);
    },
    [
      `related-product-${slug}-${tag ?? "none"}-${
        medicineForm ?? "none"
      }`,
    ],
    {
      tags: [`product:${slug}`, CACHE_TAGS.PRODUCTS, CACHE_TAGS.GLOBAL],
      revalidate: false,
    }
  )();
