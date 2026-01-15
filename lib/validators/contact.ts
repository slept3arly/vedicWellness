import { z } from "zod";

// ✅ Add disposable domains (you can expand anytime)
const disposableEmailDomains = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "dispostable.com",
  "temp-mail.org",
  "fakeinbox.com",
]);

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(80),

  // ✅ Phone: only digits, exactly 10
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, "")) // remove non-digits
    .refine((v) => /^\d{10}$/.test(v), "Phone number must be exactly 10 digits."),

  // ✅ Email: valid + not disposable
  email: z
    .string()
    .trim()
    .email("Please enter a valid email.")
    .max(120)
    .refine((val) => {
      const domain = val.split("@")[1]?.toLowerCase();
      if (!domain) return false;
      return !disposableEmailDomains.has(domain);
    }, "Temporary emails are not allowed."),

  city: z.string().trim().min(2, "Please enter your city/district.").max(80),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000),

  website: z.string().optional(), // honeypot
  turnstileToken: z.string().min(1),
});

export type ContactInput = z.infer<typeof contactSchema>;
