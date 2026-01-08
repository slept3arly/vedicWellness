import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import BottomNavbar from "@/components/BottomNavbar"
import { ThemeProvider } from "next-themes"
import { MenuProvider } from "@/components/MenuContext" // ✅ ADD THIS
import { SpeedInsights } from "@vercel/speed-insights/next"
import { inter, spaceGrotesk, playfair } from "./fonts";

export const metadata: Metadata = {
  title: "Vedic Wellness",
  description: "A Basic Website",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning  className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {/* ✅ Shared menu state lives here */}
          <MenuProvider>
            <Navbar />
            {children}
            <BottomNavbar />
          </MenuProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
