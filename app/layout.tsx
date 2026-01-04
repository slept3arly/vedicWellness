import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";
import { notoSerifExtraCondensed } from "./fonts";

export const metadata: Metadata = {
  title: "Vedic Wellness",
  description: "A Basic Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={notoSerifExtraCondensed.variable}>
        <Navbar />
        {children}
        <BottomNavbar />
      </body>
    </html>
  );
}
