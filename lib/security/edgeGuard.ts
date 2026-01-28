import { NextResponse } from "next/server";
import { auth } from "@/auth-edge";
import { Role } from "@prisma/client";

export const edgeGuard = auth((req) => {
  const { nextUrl, auth: session } = req;
  const path = nextUrl.pathname;

  const role = session?.user?.role;

  // 👑 Admin only
  if (path.startsWith("/admin/") || path === "/admin") {
    if (!session || role !== Role.ADMIN) {
      const url = new URL("/login", nextUrl);
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  // 📞 Sales + Admin
  if (path.startsWith("/sales/") || path === "/sales") {
  if (!session || !role || !([Role.ADMIN, Role.SALES] as Role[]).includes(role)) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
}


  // 🔐 Product detail pages only (not listing)
  if (path !== "/products" && path.startsWith("/products")) {
    if (!session) {
      const url = new URL("/login", nextUrl);
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});
