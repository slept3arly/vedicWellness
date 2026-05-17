import "server-only";

import { NextResponse } from "next/server";
import { secureMutation } from "@/lib/security/secureMutation";
import { errorResponse } from "@/lib/security/guard";
import { processSignup } from "@/lib/services/signupService";

export async function POST(req: Request) {
  try {
    console.log("API HIT");

    await secureMutation(req, { limit: "signup" });

    console.log("SECURE MUTATION PASSED");

    const body = await req.json().catch(() => null);

    console.log("REQUEST BODY:", body);

    if (!body) {
      console.log("INVALID BODY");

      return NextResponse.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const result = await processSignup(body, req);

    console.log("PROCESS SIGNUP RESULT:", result);

    if (!result.ok) {
      console.log("SIGNUP FAILED:", result.error);

      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status ?? 400 }
      );
    }

    console.log("SIGNUP SUCCESS");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.log("API ERROR:", err);

    return errorResponse(err);
  }
}