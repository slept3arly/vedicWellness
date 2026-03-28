import "server-only";
import { prisma } from "@/lib/db/prisma";
import { MedicineForm } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
/* ------------------------------------------------------------------ */
/* Write Operations (Admin)                                           */
/* ------------------------------------------------------------------ */

export async function createProductDB(
  data: Prisma.ProductCreateInput
){
  return prisma.product.create({
    data,
    select: { id: true },
  });
}

export async function updateProductDB(
  id: string,
  data: Prisma.ProductUpdateInput
){
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProductDB(id: string) {
  return prisma.product.delete({ where: { id } });
}

/* ------------------------------------------------------------------ */
/* Admin Reads                                                        */
/* ------------------------------------------------------------------ */

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    select: {
  id: true,
  name: true,
  slug: true,
  imageUrl: true,
  gallery: true,

  // 🔥 ADD THESE
  price: true,
  published: true,

  // 🔥 REQUIRED for audit diff
  variants: {
    select: {
      id: true,
    },
  },
}
  });
}

export async function getAdminProducts(
  page = 1,
  limit = ADMIN_PAGE_SIZE,
  q = ""
) {
  const skip = (page - 1) * limit;
  const query = q.trim();

  let medicineFormFilter: MedicineForm | undefined;

  if (query) {
    const upper = query.toUpperCase();
    if (Object.values(MedicineForm).includes(upper as MedicineForm)) {
      medicineFormFilter = upper as MedicineForm;
    }
  }

  const where = query
    ? {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            shortDescription: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            tag: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          ...(medicineFormFilter
            ? [{ medicineForm: medicineFormFilter }]
            : []),
        ],
      }
    : {};

  const [data, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        subtitle: true,
        price: true,
        compareAtPrice: true,
        currency: true,
        stock: true,
        tag: true,
        medicineForm: true,
        imageUrl: true,
        gallery: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}

/* ------------------------------------------------------------------ */
/* Public Reads (SEARCH + SORT READY)                                 */
/* ------------------------------------------------------------------ */

type PublicProductQuery = {
  page?: number;
  limit?: number;
  query?: string;
  sort?: string;
};

export async function getPublicProductsDB({
  page = 1,
  limit = 10,
  query = "",
  sort = "name_asc",
}: PublicProductQuery) {
  const skip = (page - 1) * limit;

  const q = query.trim();

  /* --------------------------------------------------------------- */
  /* MedicineForm Enum Matching (case-insensitive user input)        */
  /* --------------------------------------------------------------- */

  let medicineFormFilter: MedicineForm | undefined;

  if (q) {
    const upper = q.toUpperCase();
    if (Object.values(MedicineForm).includes(upper as MedicineForm)) {
      medicineFormFilter = upper as MedicineForm;
    }
  }

  /* --------------------------------------------------------------- */
  /* WHERE (Loose OR Search)                                         */
  /* --------------------------------------------------------------- */

  const where = {
    published: true,
    ...(q && {
      OR: [
        {
          name: {
            contains: q,
            mode: "insensitive" as const,
          },
        },
        {
          shortDescription: {
            contains: q,
            mode: "insensitive" as const,
          },
        },
        {
          tag: {
            contains: q,
            mode: "insensitive" as const,
          },
        },
        ...(medicineFormFilter
          ? [{ medicineForm: medicineFormFilter }]
          : []),
      ],
    }),
  };

  /* --------------------------------------------------------------- */
  /* SORTING                                                         */
  /* --------------------------------------------------------------- */

  let orderBy:
    | { name: "asc" | "desc" }
    | { price: "asc" | "desc" }
    | { createdAt: "asc" | "desc" } = { name: "asc" };

  switch (sort) {
    case "name_desc":
      orderBy = { name: "desc" };
      break;
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = { name: "asc" };
  }

  /* --------------------------------------------------------------- */
  /* QUERY                                                           */
  /* --------------------------------------------------------------- */

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        tag: true,
        price: true,
        imageUrl: true,
        shortDescription: true,
        createdAt: true,
        medicineForm: true,
      },
    }),
  ]);

  return { total, products };
}

export async function getPublicProductBySlugDB(slug: string) {
  return prisma.product.findFirst({
    where: { slug, published: true },
    include: {
      variants: true,
      specifications: true,
      faqs: true,
      reviews: true,
    },
  });
}

export async function getPublicProductMetadataDB(slug: string) {
  return prisma.product.findFirst({
    where: { slug, published: true },
    select: {
      name: true,
      shortDescription: true,
      imageUrl: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Lightweight Slug Fetch (Sitemap + Static Generation)               */
/* ------------------------------------------------------------------ */

export async function getAllPublishedProductSlugs() {
  return prisma.product.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Related Products (Optimized - Lightweight Select)                  */
/* ------------------------------------------------------------------ */

export async function getRelatedProductsDB(
  currentId: string,
  tag?: string | null,
  medicineForm?: MedicineForm | null,
  limit = 4
) {
  const orConditions: Prisma.ProductWhereInput[] = [];

  if (tag) orConditions.push({ tag });
  if (medicineForm) orConditions.push({ medicineForm });
  if (orConditions.length === 0) return [];

  return prisma.product.findMany({
    where: {
      published: true,
      id: { not: currentId },
      OR: orConditions,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      imageUrl: true,
      shortDescription: true,
      tag: true,
      medicineForm: true,
      createdAt: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/* ADMIN READ SINGLE PRODUCT                                          */
/* ------------------------------------------------------------------ */

export async function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
    },
  });
}