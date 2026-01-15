import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80),

  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Phone number is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email.")
    .max(120),

  city: z
    .string()
    .trim()
    .min(2, "Please enter your city/district.")
    .max(80),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000),

  // spam protection
  website: z.string().optional(), // honeypot
  turnstileToken: z.string().min(1),
});

export type ContactInput = z.infer<typeof contactSchema>;
