import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

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

  // ✅ CSRF defense: block cross-site unsafe methods to /admin
  if (UNSAFE_METHODS.has(req.method)) {
    const host = req.headers.get("host") || "";
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");

    // If both missing, we block (strict mode)
    if (!origin && !referer) {
      return new NextResponse("CSRF blocked: missing origin/referer", {
        status: 403,
      });
    }

    if (origin) {
      try {
        const o = new URL(origin);
        if (o.host !== host) {
          return new NextResponse("CSRF blocked: origin mismatch", {
            status: 403,
          });
        }
      } catch {
        return new NextResponse("CSRF blocked: invalid origin", { status: 403 });
      }
    } else if (referer) {
      try {
        const r = new URL(referer);
        if (r.host !== host) {
          return new NextResponse("CSRF blocked: referer mismatch", {
            status: 403,
          });
        }
      } catch {
        return new NextResponse("CSRF blocked: invalid referer", {
          status: 403,
        });
      }
    }
  }

  return NextResponse.next();
}

// ✅ match only /admin
export const config = {
  matcher: ["/admin/:path*"],
};
