import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getSecurityHeaders } from "@/lib/security/headers";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ allow static + internal next assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // ✅ allow NextAuth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // ✅ allow login page (public)
  if (pathname.startsWith("/login")) {
    const res = NextResponse.next();
    const headers = getSecurityHeaders();
    Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // ✅ protect /admin
  if (pathname.startsWith("/admin")) {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    if (!isLoggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/login"; // since you said you implemented single login route
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ✅ apply security headers to all normal requests
  const res = NextResponse.next();
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export const config = {
  // Match ALL routes except static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
