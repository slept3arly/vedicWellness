import {
  createProductDB,
  updateProductDB,
  deleteProductDB,
  getProductById,
  getPublicProductsDB,
  getPublicProductBySlugDB,
  getPublicProductMetadataDB,
} from "@/lib/db/product";

import { parseProductForm } from "@/lib/validators/product";
import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/storage/r2/delete";
import { auditWithContext } from "@/lib/observability/auditWithContext";

/* ------------------------------------------------------------------ */
/* Admin Services */
/* ------------------------------------------------------------------ */

export async function createProductService(
  formData: FormData,
  adminId: string
) {
  const data = parseProductForm(formData);

  const product = await createProductDB(data);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "PRODUCTS",
    entityId: product.id,
    metadata: {
      kind: "PRODUCT",
      name: data.name,
      slug: data.slug,
      published: data.published,
      price: data.price,
    },
  });

  return product.id;
}

export async function updateProductService(
  formData: FormData,
  adminId: string
) {
  const data = parseProductForm(formData);
  if (!data.id) throw new Error("Missing product id");

  const current = await getProductById(data.id);

  await updateProductDB(data.id, data);

  if (
    current?.imageUrl &&
    data.imageUrl &&
    current.imageUrl !== data.imageUrl
  ) {
    const key = getR2KeyFromPublicUrl(current.imageUrl);
    if (key) await deleteFromR2(key);
  }

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "PRODUCTS",
    entityId: data.id,
    metadata: {
      kind: "PRODUCT",
      name: data.name,
      slug: data.slug,
      published: data.published,
      price: data.price,
    },
  });
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
    entityType: "PRODUCTS",
    entityId: id,
    metadata: {
      kind: "PRODUCT",
      name: product?.name ?? null,
      from: published,
      to: !published,
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

  if (Array.isArray(product?.gallery)) {
    for (const url of product.gallery) {
      if (typeof url === "string") {
        const key = getR2KeyFromPublicUrl(url);
        if (key) await deleteFromR2(key);
      }
    }
  }

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "PRODUCTS",
    entityId: id,
    metadata: {
      kind: "PRODUCT",
      name: product?.name ?? null,
      slug: product?.slug ?? null,
      hadCover: Boolean(product?.imageUrl),
      galleryCount: Array.isArray(product?.gallery)
        ? product.gallery.length
        : 0,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Public Services */
/* ------------------------------------------------------------------ */

const PUBLIC_PAGE_SIZE = 10;

export async function getPublicProductsService(page: number) {
  const { total, products } = await getPublicProductsDB(
    page,
    PUBLIC_PAGE_SIZE
  );

  const totalPages = Math.max(
    1,
    Math.ceil(total / PUBLIC_PAGE_SIZE)
  );

  return {
    products,
    total,
    totalPages,
    pageSize: PUBLIC_PAGE_SIZE,
  };
}

export async function getPublicProductBySlugService(slug: string) {
  return getPublicProductBySlugDB(slug);
}

export async function getPublicProductMetadataService(slug: string) {
  return getPublicProductMetadataDB(slug);
}