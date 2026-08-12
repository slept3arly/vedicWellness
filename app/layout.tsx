import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/public/layout/Navbar";
import ScrollAwareHeader from "@/components/public/layout/ScrollAwareHeader";
import BottomNavbar from "@/components/public/layout/BottomNavbarClient";
import { playfair, montserrat, lato, cormorant } from "./fonts";
import MarqueeBanner from "@/components/public/layout/MarqueeBanner";
import GlobalBackground from "@/components/public/layout/GlobalBackground";
import RouteLoader from "@/components/public/feedback/RouteLoader";
import Providers from "@/app/Providers";
import { Toaster } from "sonner";
import DeferredFooter from "@/components/public/layout/DeferredFooter";
import PromotionModal from "@/components/public/layout/PromotionModal";
import { getActiveBannerCached } from "@/lib/services/public/bannerService";
import Script from "next/script";

// ✅ ADD THIS
import { auth } from "@/auth";

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
    languages: { "en-IN": SITE_URL },
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
  // ✅ FETCH SESSION + BANNER IN PARALLEL
  const [banner, session] = await Promise.all([
    getActiveBannerCached(),
    auth(),
  ]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${montserrat.variable} ${lato.variable} ${cormorant.variable}`}
    >
      <body className="font-body relative min-h-dvh flex flex-col overflow-x-hidden">
        <GlobalBackground />

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

        {/* ✅ PASS SESSION HERE */}
        <Providers session={session}>
          <PromotionModal banner={banner} />
          <RouteLoader />

          <ScrollAwareHeader>
            <Navbar />
            <MarqueeBanner />
          </ScrollAwareHeader>

          <main className="flex-1 pt-[7.5rem] pb-12 md:pb-0 space-y-6 md:space-y-10">
            {children}
          </main>

          <DeferredFooter />
        </Providers>

        <Toaster
          position="top-center"
          visibleToasts={1}
          richColors={false}
          expand={false}
          closeButton={false}
          offset={110}
          gap={8}
          swipeDirections={["right", "top"]}
          toastOptions={{
            duration: 2000,
            unstyled: true,
            classNames: {
              toast:
                "flex items-start gap-3 w-[calc(100vw-24px)] sm:w-[360px] px-4 py-3 font-body " +
                "rounded-[10px] border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]",
              title:
                "font-body text-[0.85rem] font-semibold leading-snug text-[var(--text-main)]",
              description:
                "font-body text-[0.75rem] leading-snug mt-0.5 text-[var(--text-muted)]",
              icon: "mt-0.5 shrink-0",
            },
          }}
        />
      </body>
    </html>
  );
}