import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ ultra-light middleware: ONLY redirect /admin if not logged in
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // only run for /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // ✅ check NextAuth session cookie exists (fast + tiny)
  const sessionCookie =
  req.cookies.get("__Secure-authjs.session-token")?.value ||
  req.cookies.get("authjs.session-token")?.value ||
  req.cookies.get("__Secure-next-auth.session-token")?.value ||
  req.cookies.get("next-auth.session-token")?.value;


  if (!sessionCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// ✅ match only /admin (do NOT match everything)
export const config = {
  matcher: ["/admin/:path*"],
};
