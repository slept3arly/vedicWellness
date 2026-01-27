import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

async function getSession(req: NextRequest) {
  const token =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      role?: string;
      verified?: boolean;
    };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await getSession(req);

  // 👑 Admin only
  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 📞 Sales + Admin
  if (pathname.startsWith("/sales")) {
    if (!session || !["ADMIN", "SALES"].includes(session.role ?? "")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 📦 Product pages (login only for now)
  if (pathname.startsWith("/products")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/products/:path*"],
};
