import type { Metadata } from "next";
import PageClient from "./AboutClient";

export const revalidate = 86400;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vedic-wellness.vercel.app";

export const metadata: Metadata = {
  title: "About — Ayurvedic PCD Pharma Franchise Company",
  description:
    "Learn about Vedic Wellness, a division of Innovia Drugs, delivering high-quality Ayurvedic products and PCD Pharma Franchise opportunities across India with monopoly rights and strong partner support.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "About — Ayurvedic PCD Pharma Franchise Company",
    description:
      "Learn about Vedic Wellness, a division of Innovia Drugs, delivering high-quality Ayurvedic products and PCD Pharma Franchise opportunities across India with monopoly rights and strong partner support.",
    siteName: "Vedic Wellness",
    images: [
      {
        url: `${SITE_URL}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "About Vedic Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Ayurvedic PCD Pharma Franchise Company",
    description:
      "Learn about Vedic Wellness, a division of Innovia Drugs, delivering high-quality Ayurvedic products and PCD Pharma Franchise opportunities across India with monopoly rights and strong partner support.",
    images: [`${SITE_URL}/og.jpg`],
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Vedic Wellness",
  url: `${SITE_URL}/about`,
  description:
    "Learn about Vedic Wellness, an Ayurvedic PCD pharma franchise brand offering products, monopoly rights and distributor support across India.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Vedic Wellness?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Vedic Wellness is the Ayurvedic healthcare brand of Innovia Drugs, offering GMP-certified Ayurvedic, herbal and wellness products through a PCD pharma franchise model across India.",
      },
    },
    {
      "@type": "Question",
      name: "What is a PCD Pharma Franchise?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A PCD Pharma Franchise allows you to distribute and market a company's products in your assigned area with complete promotional and operational support. Browse our Ayurvedic product range to see the kind of formulations a franchise covers.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide monopoly rights?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Monopoly rights are provided for selected areas based on availability, so each distributor gets an exclusive territory to build their business.",
      },
    },
    {
      "@type": "Question",
      name: "What distributor and franchise support do you provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Partners receive promotional support, visual aids, product cards, and marketing guidance along with reliable dispatch. For a specific question, contact the Vedic Wellness team.",
      },
    },
    {
      "@type": "Question",
      name: "How do I become a franchise or distribution partner?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Start by sharing your name, city or district and the territory you are interested in through our enquiry form. You can also create an account to view the product catalogue and manage enquiries.",
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <PageClient />
    </>
  );
}
