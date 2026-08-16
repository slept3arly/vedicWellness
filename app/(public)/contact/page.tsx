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
            title="PCD Pharma Franchise & Ayurvedic Product Enquiries"
            preview="If you're looking for the Best Ayurvedic PCD Pharma Franchise company in India or any kind of franchise oppurtunity inside your district/area, contact the Vedic Wellness team."
          >
            <p>
              Vedic Wellness is an Ayurvedic PCD pharma franchise company setup in Ambala City, Haryana.
              It offers oppurtunities in franchise and distribution pan-India. 
              You can enquire about our {" "}
              <SeoLink href="/products">Ayurvedic product range </SeoLink>
               and other buisness support to directly to our team of professionals.
            </p>

            <p>
              Vedic Wellness is located in Ambala City, Haryana and serves customers and franchise partners all across India, in every different part.
              Distributors and entrepreneurs interested in Ayurvedic products, herbal healthcare products and other oppurtunities.
            </p>

            <p>
              Contact us by phone, email or through enquiry form on this page.
              Vedic Wellness publishes blogs regularly, read our insights into Ayurveda{" "}
              <SeoLink href="/blogs">
                in our blogs.
              </SeoLink>
            </p>
          </ExpandableSeoContent>
        </div>
      </section>
    </>
  );
}
