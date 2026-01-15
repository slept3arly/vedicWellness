import "server-only";
import { buildCspHeader } from "@/lib/security/csp";

export function getSecurityHeaders() {
  const isDev = process.env.NODE_ENV !== "production";

  return {
    // Don’t leak types or allow MIME sniffing
    "X-Content-Type-Options": "nosniff",

    // Clickjacking protection (backup; CSP frame-ancestors is primary)
    "X-Frame-Options": "DENY",

    // Restrict referrer leakage
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Modern permission restrictions
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()",

    // Basic transport security (works only if HTTPS enforced)
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",

    // CSP
    "Content-Security-Policy": buildCspHeader({ isDev }),
  } as const;
}
