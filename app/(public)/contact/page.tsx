import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Contact Vedic Wellness | Ayurvedic PCD Pharma Franchise Enquiry",
  description:
    "Contact Vedic Wellness for Ayurvedic PCD Pharma Franchise opportunities, product catalog, monopoly rights, and distributor support across India. Fast response via WhatsApp and enquiry form.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
