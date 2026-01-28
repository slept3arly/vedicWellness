export { edgeGuard as middleware } from "@/lib/security/edgeGuard";

export const config = {
  matcher: [
    "/admin/:path*",
    "/sales/:path*",
    "/products/:path*",
  ],
};
