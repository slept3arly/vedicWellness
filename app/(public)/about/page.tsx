import type { Metadata } from "next";
import PageClient from "./AboutClient";

export const revalidate = 86400;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vedic-wellness.vercel.app";

export const metadata: Metadata = {
  title: "About Vedic Wellness | Ayurvedic PCD Pharma Franchise Company",
  description:
    "Learn about Vedic Wellness, a division of Innovia Drugs, delivering high-quality Ayurvedic products and PCD Pharma Franchise opportunities across India with monopoly rights and strong partner support.",
  alternates: { canonical: "/about" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a PCD Pharma Franchise?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A PCD Pharma Franchise allows you to distribute and market a company’s products in your assigned area with support such as product range, marketing tools, and guidance.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide monopoly rights?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes, monopoly rights are provided for selected areas depending on availability, ensuring better business potential.",
      },
    },
    {
      "@type": "Question",
      name: "What is the minimum order requirement?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Minimum order depends on your selected product range and is designed to be distributor-friendly so partners can start with low investment.",
      },
    },
    {
      "@type": "Question",
      name: "What is the dispatch / delivery time?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Orders are dispatched quickly after confirmation, and delivery time depends on your location with a focus on fast processing and safe packaging.",
      },
    },
    {
      "@type": "Question",
      name: "Is promotional support included?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes, promotional support is provided including brochures, visual aids, product cards, and other marketing materials.",
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageClient />
    </>
  );
}
