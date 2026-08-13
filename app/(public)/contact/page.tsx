import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import ExpandableSeoContent from "@/components/public/ui/ExpandableSeoContent";
import SeoLink from "@/components/public/ui/SeoLink";

export const revalidate = 86400;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vedic-wellness.vercel.app";

export const metadata: Metadata = {
  title: "Contact — Ayurvedic PCD Pharma Franchise & Distributor Enquiries",
  description:
    "Contact Vedic Wellness for Ayurvedic PCD Pharma franchise opportunities, distributor support, monopoly rights and product enquiries across India. Call +91 93060 25799 or WhatsApp us.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/contact`,
    title: "Contact Vedic Wellness | Ayurvedic PCD Pharma Franchise Enquiry",
    description:
      "Contact Vedic Wellness for Ayurvedic PCD Pharma franchise opportunities, distributor support, monopoly rights and product enquiries across India. Call +91 93060 25799 or WhatsApp us.",
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
    title: "Contact Vedic Wellness | Ayurvedic PCD Pharma Franchise Enquiry",
    description:
      "Contact Vedic Wellness for Ayurvedic PCD Pharma franchise opportunities, distributor support, monopoly rights and product enquiries across India. Call +91 93060 25799 or WhatsApp us.",
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
              Use this page to contact Vedic Wellness about Ayurvedic products, product
              enquiries, wholesale requirements, distribution opportunities and franchise
              enquiries. If you are exploring our{" "}
              <SeoLink href="/products">Ayurvedic product range</SeoLink>
              , you can contact our team for product-related enquiries and further
              information.
            </p>

            <p>
              We also assist with distributor support and franchise enquiries, including
              questions about distribution opportunities across India, territory
              requirements and monopoly rights. Share your name, city or district and
              details of your requirement through the enquiry form so our team can
              understand how to assist you.
            </p>

            <p>
              For more information about Vedic Wellness, you can{" "}
              <SeoLink href="/blogs">
                explore our latest Ayurveda and franchise insights
              </SeoLink>
              . You can also contact us directly by phone or WhatsApp for assistance
              with your enquiry.
            </p>
          </ExpandableSeoContent>
        </div>
      </section>
    </>
  );
}
