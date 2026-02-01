import { z } from "zod";

export const MarqueeItemSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1),
  order: z.number().int(),
  isActive: z.boolean(),
});

export function parseMarqueeForm(formData: FormData) {
  return MarqueeItemSchema.parse({
    id: formData.get("id")?.toString(),

    text: String(formData.get("text") ?? "").trim(),

    order: Number(formData.get("order") ?? 0),

    isActive: formData.get("isActive") === "on",
  });
}

export function parseMarqueeId(formData: FormData) {
  return String(formData.get("id") ?? "").trim();
}
