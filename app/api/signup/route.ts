import "server-only";

import { NextResponse } from "next/server";
import { secureMutation } from "@/lib/security/secureMutation";
import { errorResponse } from "@/lib/security/guard";
import { processSignup } from "@/lib/services/signupService";

export async function POST(req: Request) {
  try {
    await secureMutation(req, { limit: "signup" });

    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const result = await processSignup(body, req);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status ?? 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
