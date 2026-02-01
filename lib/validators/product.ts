import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),

  name: z.string().min(1),
  slug: z.string().min(1),

  price: z.number().positive(),

  tag: z.string().nullable(),
  shortDescription: z.string().nullable(),

  imageUrl: z.string().nullable(),
  gallery: z.array(z.string()),

  medicineForm: z.any().nullable(),
  packaging: z.array(z.string()),

  indications: z.array(z.string()),
  ingredients: z.array(z.string()),
  directionsToUse: z.array(z.string()),
  contraindications: z.array(z.string()),

  published: z.boolean(),
});

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

export function parseProductForm(formData: FormData) {
  const slug = slugify(String(formData.get("slug") ?? ""));

  const priceRaw = String(formData.get("price") ?? "");
  const price = Number(priceRaw);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Selling price must be a valid number.");
  }

  return ProductSchema.parse({
    id: formData.get("id")?.toString(),

    name: String(formData.get("name") ?? "").trim(),
    slug,

    price,

    tag: String(formData.get("tag") ?? "").trim() || null,
    shortDescription:
      String(formData.get("shortDescription") ?? "").trim() || null,

    imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
    gallery: parseLines(formData.get("gallery")),

    medicineForm:
      String(formData.get("medicineForm") ?? "").trim() || null,

    packaging: parseLines(formData.get("packagingText")),

    indications: parseLines(formData.get("indications")),
    ingredients: parseLines(formData.get("ingredients")),
    directionsToUse: parseLines(formData.get("directionsToUse")),
    contraindications: parseLines(formData.get("contraindications")),

    published: formData.get("published") === "on",
  });
}
