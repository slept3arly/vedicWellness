import "server-only";

import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/validators/contact";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { limits } from "@/lib/security/limits";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { createLead } from "@/lib/db/lead";
import { sanitizeText } from "@/lib/security/sanitize";
import { hasMxRecord } from "@/lib/security/email";
import { assertSameOriginRequest } from "@/lib/security/csrf"; // ✅ ADD

function getIpFromRequest(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

export async function POST(req: Request) {
  try {
    // ✅ CSRF same-origin validation
    assertSameOriginRequest(req);

    // 1) Rate limit (by IP)
    const ip = getIpFromRequest(req);
    await rateLimitOrThrow(`contact:${ip}`, limits.contact);

    // 2) Parse body safely
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // 3) Honeypot (bots fill hidden fields)
    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 4) Validate using zod
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "All fields are compulsory", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, city, message, turnstileToken } = parsed.data;

    // ✅ Reject fake email domains (no MX records)
    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (!emailDomain || !(await hasMxRecord(emailDomain))) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
          issues: {
            fieldErrors: {
              email: ["Email domain does not exist or cannot receive emails."],
            },
          },
        },
        { status: 400 }
      );
    }

    // 5) Verify Turnstile
    const turnstile = await verifyTurnstile(turnstileToken, ip);
    if (!turnstile.success) {
      return NextResponse.json(
        { error: "Turnstile verification failed" },
        { status: 403 }
      );
    }

    // 6) Sanitize text fields (avoid stored XSS in admin panel)
    const safeLead = {
  name: sanitizeText(name),
  email: email.toLowerCase(),
  phone: sanitizeText(phone ?? ""),
  city: sanitizeText(city),          // ✅ now stored properly
  message: sanitizeText(message),   // ✅ clean message only
  ip,
  userAgent: req.headers.get("user-agent") ?? null,
};


    // 7) Store in DB
    await createLead(safeLead);

    return NextResponse.json({ ok: true }, { status: 200 });
  }  catch (err: any) {
    // ✅ CSRF / rate-limit friendly mapping
    if (err?.message?.startsWith("CSRF blocked")) {
      return NextResponse.json({ error: "Invalid request" }, { status: 403 });
    }

    const status = typeof err?.status === "number" ? err.status : 500;

    const msg =
      err?.message === "RATE_LIMITED"
        ? "Too many requests"
        : "Something went wrong";

    return NextResponse.json({ error: msg }, { status });
  }

}
