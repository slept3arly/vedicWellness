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

// 👉 Update these to your exact business identity
const BRAND_NAME = "Vedic Wellness";
const BRAND_TAGLINE =
  "Best Ayurvedic PCD Pharma Franchise Company in Haryana | Pan India Shipping";
const BRAND_DESCRIPTION =
  "Vedic Wellness is a division of Innovia Drugs, offering Ayurvedic PCD Pharma Franchise opportunities across India. High-quality Ayurvedic products, monopoly rights, marketing support, and Pan India delivery.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${BRAND_NAME} | Ayurvedic PCD Pharma Franchise`,
    template: `%s | ${BRAND_NAME}`,
  },

  description: BRAND_DESCRIPTION,

  applicationName: BRAND_NAME,
  category: "Health",
  creator: BRAND_NAME,
  publisher: BRAND_NAME,

  keywords: [
    "Ayurvedic PCD Pharma Franchise",
    "Best PCD Pharma Franchise",
    "PCD Pharma Franchise Haryana",
    "Ayurvedic Franchise Company",
    "PCD Franchise Company India",
    "Ayurvedic Products Franchise",
    "PCD Pharma Franchise Pan India",
    "Innovia Drugs division",
  ],

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${BRAND_NAME} | Ayurvedic PCD Pharma Franchise`,
    description: BRAND_DESCRIPTION,
    siteName: BRAND_NAME,
    locale: "en_IN",
    images: [
      {
        url: "/og.jpg", // create this later (1200x630)
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} - Ayurvedic PCD Pharma Franchise`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Ayurvedic PCD Pharma Franchise`,
    description: BRAND_DESCRIPTION,
    images: ["/og.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
  icon: [
    { url: "/favicon.ico" }, // fallback for browsers

    // ✅ PNG favicons (Google likes these)
    { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
    { url: "/favicon-72.png", sizes: "72x72", type: "image/png" },
    { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
    { url: "/favicon-128.png", sizes: "128x128", type: "image/png" },
    { url: "/favicon-256.png", sizes: "256x256", type: "image/png" },

    // optional: svg
    { url: "/v-cropped.svg", type: "image/svg+xml" },
  ],

  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
},



  verification: {
    google: "7j7lQFxzJjZu_dYzbYtTKEQi5MkqDWWCk96qaOEwTuM",
  },

  other: {
    "geo.region": "IN-HR",
    "geo.placename": "Haryana",
    "distribution": "global",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
    >
      <body className="relative min-h-screen">
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
        brand: {
          "@type": "Brand",
          name: BRAND_NAME,
        },
        parentOrganization: {
          "@type": "Organization",
          name: "Innovia Drugs",
        },
        sameAs: [
          "https://www.instagram.com/vedic.wellness.official",
          "https://www.facebook.com/vedicwellnessid/",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: BRAND_NAME,
        image: `${SITE_URL}/og.jpg`,
        url: SITE_URL,
        telephone: "+91-9306025799",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Plot no. 149-150, Markanda Complex, Dhulkot",
          addressLocality: "Ambala City",
          addressRegion: "Haryana",
          postalCode: "134007",
          addressCountry: "IN",
        },

        areaServed: {
          "@type": "Country",
          name: "India",
        },
        priceRange: "₹₹",
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
