import "server-only";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import {
  getSignupSession,
  updateSignupSession,
} from "@/lib/auth/signupSession";

import { generateOtp } from "@/lib/auth/otp";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { errorResponse } from "@/lib/security/guard";

import { sendTransactionalEmail } from "@/lib/email";
import { VerifyEmail } from "@/lib/email/transactional/templates/VerifyEmail";

const ResendSchema = z.object({
  email: z.string().email().transform(v => v.toLowerCase().trim()),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ResendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email } = parsed.data;

    await rateLimitOrThrow(`otp-resend:${email}`, {
      windowSeconds: 300,
      max: 5,
    });

    const session = await getSignupSession(email);

    if (!session) {
      return NextResponse.json(
        { error: "Signup session expired. Please sign up again." },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    session.otpHash = await bcrypt.hash(otp, 10);
    session.attempts = 0;

    await updateSignupSession(email, session);

    await sendTransactionalEmail({
      to: email,
      subject: "Email Verification",
      react: VerifyEmail({ otp }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}