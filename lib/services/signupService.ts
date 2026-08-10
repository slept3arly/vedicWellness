import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { limits } from "@/lib/security/limits";
import { getClientIpFromRequest } from "@/lib/security/ip";

const SignupSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().email().transform(v => v.toLowerCase().trim()),
  password: z.string().min(8),
  turnstileToken: z.string(),
});

export type SignupResult =
  | { ok: true }
  | { ok: false; error: string; status?: number };

export async function processSignup(
  input: unknown,
  req: Request
): Promise<SignupResult> {
  try {
    const ip = getClientIpFromRequest(req);

    const parsed = SignupSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: "Invalid input",
        status: 400,
      };
    }

    const { name, email, password, turnstileToken } = parsed.data;

    const ts = await verifyTurnstile(turnstileToken, ip);

    if (!ts.success) {
      return {
        ok: false,
        error: "Invalid request",
        status: 400,
      };
    }

    await rateLimitOrThrow(`signup-email:${email}`, limits.signup);

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return {
        ok: false,
        error: "Unable to create account",
        status: 400,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "VIEWER",
        verified: true,
        verifiedAt: new Date(),
      },
    });

    console.info("[SIGNUP] Account created successfully");

    return { ok: true };
  } catch {
    console.error("[SIGNUP] Account creation failed");

    return {
      ok: false,
      error: "Unable to create account",
      status: 400,
    };
  }
}
