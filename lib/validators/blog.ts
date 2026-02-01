import { z } from "zod";

export const BlogSchema = z.object({
  id: z.string().optional(),

  title: z.string().min(1),
  slug: z.string().min(1),

  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),

  thumbnailUrl: z.string().optional().nullable(),

  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),

  author: z.string().default("Vedic Wellness Team"),
  category: z.string().optional().nullable(),

  tags: z.array(z.string()),

  published: z.boolean(),
});

export function parseBlogForm(formData: FormData) {
  const rawTags = String(formData.get("tags") ?? "").trim();

  return BlogSchema.parse({
    id: formData.get("id")?.toString(),

    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),

    description: String(formData.get("description") ?? "").trim() || null,
    content: String(formData.get("content") ?? "").trim() || null,

    thumbnailUrl: String(formData.get("thumbnailUrl") ?? "").trim() || null,

    metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
    metaDescription:
      String(formData.get("metaDescription") ?? "").trim() || null,
    canonicalUrl: String(formData.get("canonicalUrl") ?? "").trim() || null,

    author: String(formData.get("author") ?? "").trim() || "Vedic Wellness Team",
    category: String(formData.get("category") ?? "").trim() || null,

    tags: rawTags
      ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],

    published: formData.get("published") === "on",
  });
}
