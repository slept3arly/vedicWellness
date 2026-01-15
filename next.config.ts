import type { NextConfig } from "next";
import { buildCspHeader } from "@/lib/security/csp";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-27d15e98271842758cffe0f100c64f3c.r2.dev",
      },
    ],
  },

  async headers() {
    const isDev = process.env.NODE_ENV !== "production";

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()",
          },

          // ✅ works only over HTTPS (Vercel production yes)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // ✅ CSP
          {
            key: "Content-Security-Policy",
            value: buildCspHeader({ isDev }),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
