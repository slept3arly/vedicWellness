import "server-only";

import { NextResponse } from "next/server";
import { secureMutation } from "@/lib/security/secureMutation";
import { processContactForm } from "@/lib/services/contactService";

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
    // 🔒 CSRF + rate limit
    await secureMutation(req, { limit: "contact" });

    const ip = getIpFromRequest(req);

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const result = await processContactForm(
      body,
      ip,
      req.headers.get("user-agent") ?? null
    );

    if ((result as any).error) {
      return NextResponse.json(
        {
          error: (result as any).error,
          issues: (result as any).issues,
        },
        { status: (result as any).status ?? 400 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    const status =
      typeof err?.status === "number" ? err.status : 500;

    const msg =
      err?.message === "RATE_LIMITED"
        ? "Too many requests"
        : "Something went wrong";

    return NextResponse.json({ error: msg }, { status });
  }
}