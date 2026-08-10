import { NextResponse } from "next/server";
import { auth } from "./auth-edge";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const session = req.auth;
  const role = session?.user?.role;

  // 👑 Admin only
  if (path.startsWith("/admin")) {
    if (!session || role !== "ADMIN") {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  // 📞 Sales + Admin
  if (path.startsWith("/sales")) {
    if (!session || (role !== "ADMIN" && role !== "SALES")) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  // 🔐 Only product DETAIL pages gated
  if (path.startsWith("/products/") && path !== "/products/companies") {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/sales/:path*", "/products/:slug*"],
};
