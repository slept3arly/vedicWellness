import "server-only";

import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/validators/contact";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { createLead } from "@/lib/db/lead";
import { sanitizeText } from "@/lib/security/sanitize";
import { hasMxRecord } from "@/lib/security/email";
import { secureMutation } from "@/lib/security/secureMutation";

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
    // 🔒 CSRF + rate limit (contact)
    await secureMutation(req, { limit: "contact" });

    const ip = getIpFromRequest(req);

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // 🧪 Honeypot
    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "All fields are compulsory", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, city, message, turnstileToken } = parsed.data;

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

    const turnstile = await verifyTurnstile(turnstileToken, ip);
    if (!turnstile.success) {
      return NextResponse.json(
        { error: "Turnstile verification failed" },
        { status: 403 }
      );
    }

    const safeLead = {
      name: sanitizeText(name),
      email: email.toLowerCase(),
      phone: sanitizeText(phone ?? ""),
      city: sanitizeText(city),
      message: sanitizeText(message),
      ip,
      userAgent: req.headers.get("user-agent") ?? null,
    };

    await createLead(safeLead);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    const status = typeof err?.status === "number" ? err.status : 500;
    const msg =
      err?.message === "RATE_LIMITED"
        ? "Too many requests"
        : "Something went wrong";

    return NextResponse.json({ error: msg }, { status });
  }
}
