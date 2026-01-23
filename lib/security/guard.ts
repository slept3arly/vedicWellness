import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function errorResponse(err: unknown) {
  // ✅ rate limit errors thrown by rateLimitOrThrow
  if (err && typeof err === "object" && "status" in err) {
    const status = (err as any).status ?? 500;
    if (status === 429) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  // ✅ CSRF errors
  if (err instanceof Error && err.message.startsWith("CSRF blocked")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  }

  // ✅ Zod validation errors
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: err.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  // ✅ Bad JSON (req.json parsing failure)
  if (err instanceof Error && err.message.toLowerCase().includes("json")) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // fallback
  return NextResponse.json({ error: "Request failed" }, { status: 500 });
}
