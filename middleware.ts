import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const path = nextUrl.pathname;

  const role = session?.user?.role;
  const verified = session?.user?.verified;

  // Admin only
  if (path.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Sales + Admin
  if (path.startsWith("/sales") && !["ADMIN", "SALES"].includes(role ?? "")) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Product gating
  if (path.startsWith("/products")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (!verified) {
      return NextResponse.redirect(new URL("/verify-email", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/sales/:path*",
    "/products/:path*",
  ],
};
