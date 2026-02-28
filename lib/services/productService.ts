import {
  createProductDB,
  updateProductDB,
  deleteProductDB,
  getProductById,
  getPublicProductsDB,
  getPublicProductBySlugDB,
  getPublicProductMetadataDB,
  getAllPublishedProductSlugs,
  getRelatedProductsDB, // 👈 add this
} from "@/lib/db/product";
import { MedicineForm } from "@prisma/client";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import { parseProductForm } from "@/lib/validators/product";
import { deleteFromR2, getR2KeyFromPublicUrl } from "@/lib/storage/r2/delete";
import { auditWithContext } from "@/lib/observability/auditWithContext";

const PRODUCT_TAG = "products";
const PUBLIC_PAGE_SIZE = 10;

/* ------------------------------------------------------------------ */
/* Admin Services                                                     */
/* ------------------------------------------------------------------ */

export async function createProductService(formData: FormData, adminId: string) {
  const data = parseProductForm(formData);
  const product = await createProductDB(data);

  // Use the "default" profile to satisfy Next.js 15+ types
  revalidateTag(PRODUCT_TAG, "default");
  revalidatePath("/products");

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_CREATE",
    entityType: "PRODUCTS",
    entityId: product.id,
    metadata: { kind: "PRODUCT", name: data.name, slug: data.slug, published: data.published, price: data.price },
  });
  return product.id;
}

export async function updateProductService(formData: FormData, adminId: string) {
  const data = parseProductForm(formData);
  if (!data.id) throw new Error("Missing product id");
  const current = await getProductById(data.id);
  await updateProductDB(data.id, data);

  if (current?.imageUrl && data.imageUrl && current.imageUrl !== data.imageUrl) {
    const key = getR2KeyFromPublicUrl(current.imageUrl);
    if (key) await deleteFromR2(key);
  }

  revalidateTag(PRODUCT_TAG, "default");
  revalidatePath("/products");
  if (data.slug) revalidatePath(`/products/${data.slug}`);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "PRODUCTS",
    entityId: data.id,
    metadata: { kind: "PRODUCT", name: data.name, slug: data.slug, published: data.published, price: data.price },
  });
}

export async function toggleProductPublishedService(id: string, published: boolean, adminId: string) {
  await updateProductDB(id, { published: !published });
  const product = await getProductById(id);

  revalidateTag(PRODUCT_TAG, "default");
  revalidatePath("/products");
  if (product?.slug) revalidatePath(`/products/${product.slug}`);

  await auditWithContext({
    actorId: adminId,
    action: !published ? "ADMIN_PUBLISH" : "ADMIN_UNPUBLISH",
    entityType: "PRODUCTS",
    entityId: id,
    metadata: { kind: "PRODUCT", name: product?.name ?? null, from: published, to: !published },
  });
}

export async function deleteProductService(id: string, adminId: string) {
  const product = await getProductById(id);
  await deleteProductDB(id);
  if (product?.imageUrl) {
    const key = getR2KeyFromPublicUrl(product.imageUrl);
    if (key) await deleteFromR2(key);
  }

  revalidateTag(PRODUCT_TAG, "default");
  revalidatePath("/products");

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "PRODUCTS",
    entityId: id,
    metadata: { kind: "PRODUCT", name: product?.name ?? null, slug: product?.slug ?? null },
  });
}

/* ------------------------------------------------------------------ */
/* Public Services (DYNAMIC CACHE KEY FIX)                            */
/* ------------------------------------------------------------------ */

const getCachedPublicProducts = (page: number, query: string, sort: string) =>
  unstable_cache(
    async () => {
      console.log("DB FETCH:", { page, query, sort });
      const { total, products } = await getPublicProductsDB({
        page,
        limit: PUBLIC_PAGE_SIZE,
        query,
        sort,
      });

      return {
        products,
        total,
        totalPages: Math.max(1, Math.ceil(total / PUBLIC_PAGE_SIZE)),
        pageSize: PUBLIC_PAGE_SIZE,
      };
    },
    // FIX: Variables must be in the key array to differentiate searches
    ["public-products-list", String(page), query, sort], 
    {
      tags: [PRODUCT_TAG],
      revalidate: 3600,
    }
  )();

export const getPublicProductsService = async ({
  page = 1,
  query = "",
  sort = "name_asc",
}: { page?: number; query?: string; sort?: string }) => {
  return getCachedPublicProducts(page, query, sort);
};

/* ------------------------------------------------------------------ */
/* Individual Product (Cached)                                        */
/* ------------------------------------------------------------------ */

export const getPublicProductBySlugService = (slug: string) =>
  unstable_cache(
    async () => getPublicProductBySlugDB(slug),
    [`product-${slug}`],
    { tags: [`product:${slug}`, PRODUCT_TAG] }
  )();

export const getPublicProductMetadataService = (slug: string) =>
  unstable_cache(
    async () => getPublicProductMetadataDB(slug),
    [`product-meta-${slug}`],
    { tags: [`product:${slug}`] }
  )();

export async function getAllPublishedProductSlugsService() {
  return getAllPublishedProductSlugs();
}

/* ------------------------------------------------------------------ */
/* Related Products (Cached) */
/* ------------------------------------------------------------------ */

export const getRelatedProductsService = (
  slug: string,
  currentId: string,
  tag?: string | null,
  medicineForm?: MedicineForm | null
) =>
  unstable_cache(
    async () => {
      return getRelatedProductsDB(
        currentId,
        tag,
        medicineForm
      );
    },
    [
      `related-product-${slug}-${tag ?? "none"}-${
        medicineForm ?? "none"
      }`,
    ],
    {
      tags: [`product:${slug}`, PRODUCT_TAG],
      revalidate: 1800, // 30 minutes
    }
  )();