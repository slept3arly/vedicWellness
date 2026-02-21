import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";

import { prisma } from "@/lib/db/prisma";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { limits } from "@/lib/security/limits";
import { getClientIpFromRequest } from "@/lib/security/ip";

import { saveSignupSession } from "@/lib/auth/signupSession";
import { sendTransactionalEmail } from "@/lib/email";
import { VerifyEmail } from "@/lib/email/transactional/templates/VerifyEmail";

const SignupSchema = z.object({
  email: z.string().email().transform(v => v.toLowerCase().trim()),
  password: z.string().min(8),
  turnstileToken: z.string(),
});

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export type SignupResult =
  | { ok: true }
  | { ok: false; error: string; status?: number };

export async function processSignup(
  input: unknown,
  req: Request
): Promise<SignupResult> {
  const ip = getClientIpFromRequest(req);

  const parsed = SignupSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Invalid input", status: 400 };
  }

  const { email, password, turnstileToken } = parsed.data;

  const ts = await verifyTurnstile(turnstileToken, ip);
  if (!ts.success) {
    return { ok: false, error: "Invalid request", status: 400 };
  }

  await rateLimitOrThrow(`otp-email:${email}`, limits.otpEmail);

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { verified: true },
  });

  if (existing?.verified) {
    return {
      ok: false,
      error: "Unable to create account",
      status: 400,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await saveSignupSession(email, {
    email,
    password: hashedPassword,
    role: "VIEWER",
    otpHash: hashedOtp,
    attempts: 0,
  });

  await sendTransactionalEmail({
    to: email,
    subject: "Your verification code",
    react: VerifyEmail({ otp }),
  });

  return { ok: true };
}