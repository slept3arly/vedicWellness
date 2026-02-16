import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar.client";
import { inter, spaceGrotesk } from "./fonts";
import MarqueeBanner from "@/components/MarqueeBanner";
import GlobalBackground from "@/components/public/GlobalBackground";
import RouteLoader from "@/components/public/RouteLoader";
import Providers from "@/app/Providers";
import { Toaster } from "sonner";
import DeferredFooter from "@/components/DeferredFooter";

import Script from "next/script";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

const BRAND_NAME = "Vedic Wellness";

const BRAND_DESCRIPTION =
  "Vedic Wellness, a division of Innovia Drugs, offers premium Ayurvedic wellness products and PCD Pharma Franchise opportunities, combining traditional wisdom with modern pharmaceutical standards.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  verification: {
    google: "7j7lQFxzJjZu_dYzbYtTKEQi5MkqDWWCk96qaOEwTuM",
  },
  
  title: {
    default: `${BRAND_NAME} | Ayurvedic Wellness & Pharma Franchise`,
    template: `%s | ${BRAND_NAME}`,
  },

  description: BRAND_DESCRIPTION,

  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
    },
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${BRAND_NAME} | Ayurvedic Wellness & Pharma Franchise`,
    description: BRAND_DESCRIPTION,
    siteName: BRAND_NAME,
    images: [
      {
        url: `${SITE_URL}/og.jpg`,
        width: 1200,
        height: 630,
        alt: BRAND_NAME,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Ayurvedic Wellness & Pharma Franchise`,
    description: BRAND_DESCRIPTION,
    images: [`${SITE_URL}/og.jpg`],
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
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="relative min-h-dvh flex flex-col overflow-x-hidden">
        <GlobalBackground />

        {/* Structured data */}
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
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+91-9306025799",
                  contactType: "customer service",
                  areaServed: "IN",
                  availableLanguage: "English",
                },
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
          {/* Route transition loader (overlay only) */}
          <RouteLoader />

          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 z-40">
            <Navbar />
            <MarqueeBanner />
          </div>

          {/* Main Content */}
          <main className="flex-1 pt-[7.5rem] pb-28 md:pb-0 space-y-6 md:space-y-10">
            {children}
          </main>

          {/* Footer + Floating Actions */}
          <DeferredFooter />
          <BottomNavbar />
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
