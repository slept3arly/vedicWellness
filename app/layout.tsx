import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";
import { ThemeProvider } from "next-themes";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
        <Navbar />
        {children}
        <BottomNavbar />
        </ThemeProvider>
      </body>

    </html>
  );
}
