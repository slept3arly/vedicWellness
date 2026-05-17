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
  try {
    console.log("PROCESS SIGNUP START");

    const ip = getClientIpFromRequest(req);

    const parsed = SignupSchema.safeParse(input);

    console.log("ZOD RESULT:", parsed.success);

    if (!parsed.success) {
      console.log(parsed.error);

      return {
        ok: false,
        error: "Invalid input",
        status: 400,
      };
    }

    const { email, password, turnstileToken } = parsed.data;

    console.log("VERIFYING TURNSTILE");

    const ts = await verifyTurnstile(turnstileToken, ip);

    console.log("TURNSTILE VERIFIED:", ts);

    if (!ts.success) {
      return {
        ok: false,
        error: "Invalid request",
        status: 400,
      };
    }

    console.log("CHECKING RATE LIMIT");

    await rateLimitOrThrow(
      `otp-email:${email}`,
      limits.otpEmail
    );

    console.log("RATE LIMIT PASSED");

    console.log("CHECKING DATABASE");

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { verified: true },
    });

    console.log("DATABASE RESULT:", existing);

    if (existing?.verified) {
      return {
        ok: false,
        error: "Unable to create account",
        status: 400,
      };
    }

    console.log("HASHING PASSWORD");

    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("PASSWORD HASHED");

    const otp = generateOtp();

    console.log("OTP GENERATED");

    const hashedOtp = await bcrypt.hash(otp, 10);

    console.log("OTP HASHED");

    console.log("SAVING SESSION");

    await saveSignupSession(email, {
      email,
      password: hashedPassword,
      role: "VIEWER",
      otpHash: hashedOtp,
      attempts: 0,
    });

    console.log("SESSION SAVED");

    console.log("SENDING EMAIL");

    await sendTransactionalEmail({
      to: email,
      subject: "Your verification code",
      react: VerifyEmail({ otp }),
    });

    console.log("EMAIL SENT");

    return { ok: true };
  } catch (error) {
    console.error("PROCESS SIGNUP ERROR:", error);

    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
      status: 400,
    };
  }
}