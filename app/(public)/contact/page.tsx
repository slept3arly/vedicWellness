import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import ExpandableSeoContent from "@/components/public/ui/ExpandableSeoContent";

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
  return (
    <>
      <ContactClient />
      <section className="w-full px-4 pb-10 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <ExpandableSeoContent
            title="Business Enquiries & Distribution Opportunities"
            preview="Explore Ayurvedic products, product enquiries, wholesale or distribution enquiries, distributor support and franchise enquiries with Vedic Wellness."
          >
            <p>
              Use this page to contact Vedic Wellness about Ayurvedic products,
              product enquiries, and wholesale or distribution enquiries.
            </p>
            <p>
              Our team can also help with distributor support and franchise
              enquiries, including questions about building distribution across
              India. Share your requirement through the form or contact us
              directly so we can understand how to assist.
            </p>
          </ExpandableSeoContent>
        </div>
      </section>
    </>
  );
}
