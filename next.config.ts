import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false, // ✅ disables X-Powered-By

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
        ],
      },
    ];
  },
};

export default nextConfig;
