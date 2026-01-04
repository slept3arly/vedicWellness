import { Inter, Playfair_Display, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

export const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const noto = localFont({
  src: "../public/fonts/NotoSerif_ExtraCondensed-Regular.woff2",
  variable: "--font-noto",
});