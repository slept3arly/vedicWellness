import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-27d15e98271842758cffe0f100c64f3c.r2.dev",
        
      },
    ],
  },
};

export default nextConfig;
