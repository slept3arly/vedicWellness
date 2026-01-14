import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";
import { ThemeProvider } from "next-themes";
import { MenuProvider } from "@/components/MenuContext";
import { inter, spaceGrotesk, playfair } from "./fonts";
import MarqueeBanner from "@/components/MarqueeBanner";
import GlobalBackground from "@/components/GlobalBackground";
import RouteLoader from "@/components/RouteLoader";


export const metadata: Metadata = {
  title: "Vedic Wellness",
  description: "A Basic Website",
  icons: {
    icon: [{ url: "/v-cropped.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
    >
      <body className="relative min-h-screen">
        <GlobalBackground />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MenuProvider>
            <RouteLoader />
            <div className="fixed top-0 left-0 right-0 z-40">
              <Navbar />
              <MarqueeBanner />
            </div>

            <main className="pt-[8.5rem] pb-24 md:pb-0 overflow-x-hidden">
              {children}
            </main>

            <BottomNavbar />
          </MenuProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
