import "server-only";
import { NextResponse } from "next/server";

import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { limits } from "@/lib/security/limits";
import { verifyTurnstile } from "@/lib/security/turnstile"; // use your existing one

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
    // ✅ 1) IP
    const ip = getIpFromRequest(req);

    // ✅ 2) RATE LIMIT HERE (before doing anything heavy)
    await rateLimitOrThrow(`signup:${ip}`, limits.signup);

    // ✅ 3) parse body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { email, password, turnstileToken } = body;

    // ✅ 4) require token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Please complete verification." },
        { status: 400 }
      );
    }

    // ✅ 5) Turnstile verify
    const turnstile = await verifyTurnstile(turnstileToken, ip);
    if (!turnstile.success) {
      return NextResponse.json(
        { error: "Turnstile verification failed" },
        { status: 403 }
      );
    }

    // ✅ 6) continue signup logic...
    // validate email/password
    // create user
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    const status = typeof err?.status === "number" ? err.status : 500;

    const msg =
      err?.message === "RATE_LIMITED"
        ? "Too many signup attempts. Please try again later."
        : "Something went wrong";

    return NextResponse.json({ error: msg }, { status });
  }
}
