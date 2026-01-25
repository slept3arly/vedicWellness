import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";
import { inter, spaceGrotesk, playfair } from "./fonts";
import MarqueeBanner from "@/components/MarqueeBanner";
import GlobalBackground from "@/components/GlobalBackground";
import RouteLoader from "@/components/RouteLoader";
import Providers from "@/app/Providers";

import Script from "next/script";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

const BRAND_NAME = "Vedic Wellness";
const BRAND_DESCRIPTION =
  "Vedic Wellness is a division of Innovia Drugs, offering Ayurvedic PCD Pharma Franchise opportunities across India.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${BRAND_NAME} | Ayurvedic PCD Pharma Franchise`,
    template: `%s | ${BRAND_NAME}`,
  },

  description: BRAND_DESCRIPTION,

  alternates: { canonical: SITE_URL },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${BRAND_NAME} | Ayurvedic PCD Pharma Franchise`,
    description: BRAND_DESCRIPTION,
    siteName: BRAND_NAME,
  },

  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Ayurvedic PCD Pharma Franchise`,
    description: BRAND_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
    >
      <body className="relative min-h-screen">
        <GlobalBackground />

        {/* ✅ Structured data — CSP nonce auto-applied by Next */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: BRAND_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/logo.svg`,
                description: BRAND_DESCRIPTION,
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: BRAND_NAME,
                url: SITE_URL,
                inLanguage: "en-IN",
              },
            ]),
          }}
        />

        <Providers>
          <RouteLoader />

          <div className="fixed top-0 left-0 right-0 z-40">
            <Navbar />
            <MarqueeBanner />
          </div>

          <main className="pt-[8.5rem] pb-24 md:pb-0 overflow-x-hidden">
            {children}
          </main>

          <BottomNavbar />
        </Providers>
      </body>
    </html>
  );
}
