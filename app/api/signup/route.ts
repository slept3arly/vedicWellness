import "server-only";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { secureMutation } from "@/lib/security/secureMutation";
import { errorResponse } from "@/lib/security/guard";
import { getClientIpFromRequest } from "@/lib/security/ip";

const SignupSchema = z.object({
  email: z.string().email().transform(v => v.toLowerCase().trim()),
  password: z.string().min(8),
  turnstileToken: z.preprocess(
    v => (typeof v === "string" ? v : ""),
    z.string().min(1, "Verification required")
  ),
});

export async function POST(req: Request) {
  try {
    // 🔒 CSRF + rate limit (signup)
    await secureMutation(req, { limit: "signup" });

    const ip = getClientIpFromRequest(req);

    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password, turnstileToken } = parsed.data;

    const ts = await verifyTurnstile(turnstileToken, ip);
    if (!ts.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Unable to create account" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "VIEWER",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
