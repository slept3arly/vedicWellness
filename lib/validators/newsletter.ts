import { z } from "zod";

export const newsletterSchema = z.object({
  // Same normalization style as the signup flow (signupService.ts).
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(120, "Email must be at most 120 characters.")
    .email("Please enter a valid email."),
  source: z.string().trim().max(60).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
