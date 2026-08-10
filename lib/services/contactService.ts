import { contactSchema } from "@/lib/validators/contact";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { createLead } from "@/lib/db/lead";
import { sanitizeText } from "@/lib/security/sanitize";
import { hasMxRecord } from "@/lib/security/email";
import { sendAdminNotification } from "@/lib/email/transactional/adminNotification";

type ContactInput = unknown;

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      issues?: any;
      status?: number;
    };

export async function processContactForm(
  input: ContactInput,
  ip: string,
  userAgent: string | null
): Promise<ContactResult> {
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
      ok: false,
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
      ok: false,
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
      ok: false,
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

  const lead = await createLead(safeLead);

  try {
    await sendAdminNotification({
      type: "lead",
      leadId: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      city: lead.city,
      message: lead.message,
    });
  } catch {
    console.error("[ADMIN_NOTIFICATION_FAILED]", { type: "lead", leadId: lead.id });
  }

  return { ok: true };
}
