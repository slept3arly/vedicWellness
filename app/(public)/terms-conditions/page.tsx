import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions governing use of Vedic Wellness Ayurvedic wellness platform.",
  alternates: { canonical: "/terms-conditions" },
};

export default function Page() {
  return <TermsClient />;
}
