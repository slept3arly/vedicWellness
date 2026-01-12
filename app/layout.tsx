import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";
import { ThemeProvider } from "next-themes";
import { MenuProvider } from "@/components/MenuContext";
import { inter, spaceGrotesk, playfair } from "./fonts";
import MarqueeBanner from "@/components/MarqueeBanner";
import GlobalBackground from "@/components/GlobalBackground"; // ✅ add this

export const metadata: Metadata = {
  title: "Vedic Wellness",
  description: "A Basic Website",
  icons: {
    icon: [
      { url: "/v-cropped.svg", type: "image/svg+xml" }, // modern
    ],
  },
};


export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
    >
      <body className="relative min-h-screen overflow-x-hidden">
        {/* ✅ global animated bg */}
        <GlobalBackground />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MenuProvider>
            <div className="fixed top-0 left-0 right-0 z-40 pointer-events-auto">
              <Navbar />
              <MarqueeBanner />
            </div>

            <main className="pt-[8.5rem]">{children}</main>

            <BottomNavbar />
          </MenuProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
