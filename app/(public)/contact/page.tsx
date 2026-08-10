import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const revalidate = 86400;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

export const metadata: Metadata = {
  title: "Contact Vedic Wellness | Ayurvedic PCD Pharma Franchise Enquiry",
  description:
    "Contact Vedic Wellness for Ayurvedic PCD Pharma Franchise opportunities, product catalog, monopoly rights, and distributor support across India. Fast response via WhatsApp and enquiry form.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/contact`,
    title:
      "Contact Vedic Wellness | Ayurvedic PCD Pharma Franchise Enquiry",
    description:
      "Contact Vedic Wellness for Ayurvedic PCD Pharma Franchise opportunities, product catalog, monopoly rights, and distributor support across India. Fast response via WhatsApp and enquiry form.",
    siteName: "Vedic Wellness",
    images: [
      {
        url: `${SITE_URL}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "Contact Vedic Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Contact Vedic Wellness | Ayurvedic PCD Pharma Franchise Enquiry",
    description:
      "Contact Vedic Wellness for Ayurvedic PCD Pharma Franchise opportunities, product catalog, monopoly rights, and distributor support across India. Fast response via WhatsApp and enquiry form.",
    images: [`${SITE_URL}/og.jpg`],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
