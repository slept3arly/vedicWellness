import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/public/layout/Navbar";
import BottomNavbar from "@/components/public/layout/BottomNavbarClient";
import { playfair, montserrat, lato, cormorant } from "./fonts";
import MarqueeBanner from "@/components/public/layout/MarqueeBanner";
import GlobalBackground from "@/components/public/layout/GlobalBackground";
import RouteLoader from "@/components/public/feedback/RouteLoader";
import Providers from "@/app/Providers";
import { Toaster } from "sonner";
import DeferredFooter from "@/components/public/layout/DeferredFooter";

import PromotionModal from "@/components/public/layout/PromotionModal";
import { getActiveBannerService } from "@/lib/services/bannerService";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const banner = await getActiveBannerService();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${montserrat.variable} ${lato.variable} ${cormorant.variable}`}
    >
      <body className="font-body relative min-h-dvh flex flex-col overflow-x-hidden">
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

          {/* Promotion Modal */}
          <PromotionModal banner={banner} />

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

        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            duration: 4000,
            className:
              "rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-main)] shadow-[var(--shadow-soft)] px-4 py-2 text-sm",
          }}
        />
      </body>
    </html>
  );
}