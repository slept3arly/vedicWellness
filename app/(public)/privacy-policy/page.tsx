import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy of Vedic Wellness – Ayurvedic wellness products and pharma franchise platform.",
  alternates: { canonical: "/privacy-policy" },
};

export default function Page() {
  return <PrivacyClient />;
}
