import "server-only";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/db/prisma";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { secureMutation } from "@/lib/security/secureMutation";
import { errorResponse } from "@/lib/security/guard";
import { getClientIpFromRequest } from "@/lib/security/ip";

import { sendTransactionalEmail } from "@/lib/email";
import { VerifyEmail } from "@/lib/email/transactional/templates/VerifyEmail";

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
  console.log("TURNSTILE RESULT:", ts);

  return NextResponse.json(
    {
      error:
        process.env.NODE_ENV === "development"
          ? `Turnstile failed: ${ts["error-codes"]?.join(", ")}`
          : "Invalid request",
    },
    { status: 400 }
  );
}

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Unable to create account" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "VIEWER",
      },
    });

    const token = randomBytes(32).toString("hex");

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL;

    if (!baseUrl) {
      throw new Error("NEXTAUTH_URL not set");
    }

    const verificationUrl = `${baseUrl}/api/verify-email?token=${token}`;

    await sendTransactionalEmail({
      to: user.email,
      subject: "Verify your account",
      react: VerifyEmail({ verificationUrl }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}