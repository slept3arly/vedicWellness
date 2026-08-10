import { z } from "zod";
import { MedicineForm } from "@prisma/client";

/* ------------------------------------------------------------------ */
/* Product Schema                                                     */
/* ------------------------------------------------------------------ */

export const ProductSchema = z.object({
  id: z.string().optional(),

  /* Core */
  name: z.string().min(1),
  slug: z.string().min(1),
  companyId: z.string().min(1),
  subtitle: z.string().nullable(),

  /* Pricing */
  price: z.number().positive(),
  compareAtPrice: z.number().nullable(),
  currency: z.string(),

  /* Inventory */
  stock: z.number().int().min(0),

  /* Media */
  imageUrl: z.string().nullable(),
  gallery: z.array(z.string()),

  /* Descriptions */
  shortDescription: z.string().nullable(),
  longDescription: z.string().nullable(),

  /* Structured Content */
  highlights: z.array(z.string()),
  benefits: z.array(z.string()),
  whoShouldUse: z.array(z.string()),
  ingredients: z.array(z.string()),
  directionsToUse: z.array(z.string()),
  precautions: z.array(z.string()),
  packaging: z.array(z.string()),

  /* Technical */
  manufacturer: z.string().nullable(),
  countryOfOrigin: z.string().nullable(),
  shelfLife: z.string().nullable(),
  netQuantity: z.string().nullable(),

  /* Trust */
  trustBadges: z.array(z.string()),
  certifications: z.array(z.string()),

  /* Categorization */
  tag: z.string().nullable(),
  medicineForm: z.nativeEnum(MedicineForm).nullable(),

  /* Status */
  published: z.boolean(),
});

/* ------------------------------------------------------------------ */
/* Variant Schema                                                     */
/* ------------------------------------------------------------------ */

export const ProductVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.number().positive("Variant price must be greater than 0"),
  compareAtPrice: z.number().nullable(),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().nullable(),
});

export const ProductVariantsSchema = z.array(ProductVariantSchema);

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function parseLines(v: unknown): string[] {
  const raw = String(v ?? "").trim();
  if (!raw) return [];
  return raw
    .split(/\r?\n/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ------------------------------------------------------------------ */
/* Form Parser                                                        */
/* ------------------------------------------------------------------ */

export function parseProductForm(formData: FormData) {
  const slug = slugify(String(formData.get("slug") ?? ""));

  const price = Number(formData.get("price"));
  const compareAtPriceRaw = formData.get("compareAtPrice");
  const compareAtPrice =
    compareAtPriceRaw && String(compareAtPriceRaw).trim() !== ""
      ? Number(compareAtPriceRaw)
      : null;

  const stock = Number(formData.get("stock") ?? 0);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Selling price must be a valid number.");
  }

  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error("Stock must be a valid number.");
  }

  return ProductSchema.parse({
    id: formData.get("id")?.toString(),

    /* Core */
    name: String(formData.get("name") ?? "").trim(),
    slug,
    companyId: String(formData.get("companyId") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,

    /* Pricing */
    price,
    compareAtPrice:
      compareAtPrice && compareAtPrice > 0 ? compareAtPrice : null,
    currency: "INR",

    /* Inventory */
    stock,

    /* Media */
    imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
    gallery: parseLines(formData.get("galleryText")),

    /* Descriptions */
    shortDescription:
      String(formData.get("shortDescription") ?? "").trim() || null,
    longDescription:
      String(formData.get("longDescription") ?? "").trim() || null,

    /* Structured Content */
    highlights: parseLines(formData.get("highlights")),
    benefits: parseLines(formData.get("benefits")),
    whoShouldUse: parseLines(formData.get("whoShouldUse")),
    ingredients: parseLines(formData.get("ingredients")),
    directionsToUse: parseLines(formData.get("directionsToUse")),
    precautions: parseLines(formData.get("precautions")),
    packaging: parseLines(formData.get("packagingText")),

    /* Technical */
    manufacturer:
      String(formData.get("manufacturer") ?? "").trim() || null,
    countryOfOrigin:
      String(formData.get("countryOfOrigin") ?? "").trim() || null,
    shelfLife:
      String(formData.get("shelfLife") ?? "").trim() || null,
    netQuantity:
      String(formData.get("netQuantity") ?? "").trim() || null,

    /* Trust */
    trustBadges: parseLines(formData.get("trustBadges")),
    certifications: parseLines(formData.get("certifications")),

    /* Categorization */
    tag: String(formData.get("tag") ?? "").trim() || null,
    medicineForm:
      (formData.get("medicineForm") as MedicineForm) || null,

    /* Status */
    published: formData.get("published") === "on",
  });
}
