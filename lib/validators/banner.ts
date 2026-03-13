import { z } from "zod";

/* Banner Schema */

export const BannerSchema = z.object({
  id: z.string().optional(),

  type: z.enum(["IMAGE_ONLY", "TEXT"]),

  title: z.string().optional().nullable(),
  message: z.string().optional().nullable(),

  imageUrl: z.string().optional().nullable(),

  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),

  isActive: z.boolean(),

  startAt: z.date().optional().nullable(),
  endAt: z.date().optional().nullable(),
});

/* Parse Banner Form */

export function parseBannerForm(formData: FormData) {
  const startRaw = String(formData.get("startAt") ?? "").trim();
  const endRaw = String(formData.get("endAt") ?? "").trim();

  return BannerSchema.parse({
    id: formData.get("id")?.toString(),

    type: String(formData.get("type") ?? "TEXT") as "IMAGE_ONLY" | "TEXT",

    title: String(formData.get("title") ?? "").trim() || null,
    message: String(formData.get("message") ?? "").trim() || null,

    imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,

    buttonText: String(formData.get("buttonText") ?? "").trim() || null,
    buttonLink: String(formData.get("buttonLink") ?? "").trim() || null,

    isActive: formData.get("isActive") === "on",

    startAt: startRaw ? new Date(startRaw) : null,
    endAt: endRaw ? new Date(endRaw) : null,
  });
}

/* Parse Banner ID */

export function parseBannerId(formData: FormData) {
  return String(formData.get("id") ?? "").trim();
}