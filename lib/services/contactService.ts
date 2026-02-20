import { contactSchema } from "@/lib/validators/contact";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { createLead } from "@/lib/db/lead";
import { sanitizeText } from "@/lib/security/sanitize";
import { hasMxRecord } from "@/lib/security/email";

type ContactInput = unknown;

export async function processContactForm(
  input: ContactInput,
  ip: string,
  userAgent: string | null
) {
  // 🧪 Honeypot
  if (
    typeof (input as any)?.website === "string" &&
    (input as any).website.length > 0
  ) {
    return { ok: true };
  }

  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "All fields are compulsory",
      issues: parsed.error.flatten(),
      status: 400,
    };
  }

  const { name, email, phone, city, message, turnstileToken } =
    parsed.data;

  const emailDomain = email.split("@")[1]?.toLowerCase();
  if (!emailDomain || !(await hasMxRecord(emailDomain))) {
    return {
      error: "Please enter a valid email address.",
      issues: {
        fieldErrors: {
          email: [
            "Email domain does not exist or cannot receive emails.",
          ],
        },
      },
      status: 400,
    };
  }

  const turnstile = await verifyTurnstile(turnstileToken, ip);

  if (!turnstile.success) {
    return {
      error: "Turnstile verification failed",
      status: 403,
    };
  }

  const safeLead = {
    name: sanitizeText(name),
    email: email.toLowerCase(),
    phone: sanitizeText(phone ?? ""),
    city: sanitizeText(city),
    message: sanitizeText(message),
    ip,
    userAgent,
  };

  await createLead(safeLead);

  return { ok: true };
}