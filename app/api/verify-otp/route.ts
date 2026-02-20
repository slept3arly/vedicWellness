import "server-only";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { errorResponse } from "@/lib/security/guard";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";

import {
  getSignupSession,
  deleteSignupSession,
  updateSignupSession,
} from "@/lib/auth/signupSession";

const VerifySchema = z.object({
  email: z.string().email().transform(v => v.toLowerCase().trim()),
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, otp } = parsed.data;

    await rateLimitOrThrow(`otp-verify:${email}`, {
      windowSeconds: 300,
      max: 10,
    });

    const session = await getSignupSession(email);

    if (!session) {
      return NextResponse.json(
        { error: "OTP expired or not found" },
        { status: 400 }
      );
    }

    if (session.attempts >= 5) {
      return NextResponse.json(
        { error: "Too many attempts. Request a new code." },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(otp, session.otpHash);

    if (!valid) {
      session.attempts += 1;
      await updateSignupSession(email, session);

      return NextResponse.json(
        { error: `Invalid OTP. ${5 - session.attempts} attempts remaining.` },
        { status: 400 }
      );
    }

    await prisma.user.create({
      data: {
        email: session.email,
        password: session.password,
        role: session.role,
        verified: true,
        verifiedAt: new Date(),
      },
    });

    await deleteSignupSession(email);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}