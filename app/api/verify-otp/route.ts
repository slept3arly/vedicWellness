import "server-only";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { redis } from "@/lib/redis";
import { errorResponse } from "@/lib/security/guard";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";

import {
  getSignupSession,
  deleteSignupSession,
  updateSignupSession,
} from "@/lib/auth/signupSession";

import { Role } from "@prisma/client";

// ✅ Brevo marketing imports
import { addSubscriberToBrevo } from "@/lib/email/marketing/contacts";
import { sendMarketingEmail } from "@/lib/email/marketing/send";
import { WelcomeEmail } from "@/lib/email/marketing/templates/WelcomeEmail";
import { secureMutation } from "@/lib/security/secureMutation";

const VerifySchema = z.object({
  email: z.string().email().transform(v => v.toLowerCase().trim()),
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    await secureMutation(req, { limit: "signup" });
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
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

    // 🔒 Prevent brute force
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

    /**
     * 🔐 Atomic verify lock
     * Prevents duplicate user creation
     */
    const lockKey = `signup:verify-lock:${email}`;

    const lock = await redis.set(lockKey, "1", {
      nx: true,
      ex: 10,
    });

    if (!lock) {
      return NextResponse.json(
        { error: "Verification already in progress." },
        { status: 400 }
      );
    }

    /**
     * ✅ Create verified user
     */
    const user = await prisma.user.create({
      data: {
        email: session.email,
        password: session.password,
        role: session.role as Role,
        verified: true,
        verifiedAt: new Date(),
      },
    });

    /**
 * 📩 Marketing integration
 * Must NEVER break auth flow
 */
try {
  console.log(`📨 [verify-otp] Starting marketing integration for successfully verified user: ${user.email}`);

  // 1. Add contact to Brevo
  const contactRes = await addSubscriberToBrevo(user.email);
  if (contactRes.success) {
    console.log(`✅ [verify-otp] Subscriber successfully added to Brevo for user: ${user.email}`);
  } else {
    console.warn(`⚠️ [verify-otp] addSubscriberToBrevo returned failure status:`, contactRes.error);
  }

  // 2. Send welcome email to user
  console.log(`📨 [verify-otp] Triggering sendMarketingEmail for user: ${user.email}`);
  const emailRes = await sendMarketingEmail({
    to: user.email,
    subject: "Welcome to Vedic Wellness",
    html: WelcomeEmail(user.email),
  });

  console.log(`📨 [verify-otp] sendMarketingEmail completed successfully for user: ${user.email}. Response:`, JSON.stringify(emailRes, null, 2));
} catch (err: any) {
  console.error("❌ [verify-otp] Exception caught during post-verification Brevo marketing flow:");
  console.error(`- Error: ${err.message || err}`);
  if (err.stack) {
    console.error(`- Stack trace: ${err.stack}`);
  }
}

    // 🧹 Cleanup Redis session
    await deleteSignupSession(email);

    return NextResponse.json({ ok: true });

  } catch (err) {
    return errorResponse(err);
  }
}