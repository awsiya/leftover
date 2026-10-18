import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serifFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leftover Tile Project Planner — Upcycle Surplus Ceramic & Stone Tiles",
  description:
    "Match your leftover renovation tiles to curated DIY projects. Deterministic area calculations, 1:1 cutting templates, and architectural printable plans for $4.99.",
  keywords: [
    "leftover tile projects",
    "upcycle ceramic tiles",
    "tile mosaic DIY",
    "tile planter tutorial",
    "tile trivet plans",
    "tile cut calculator",
  ],
  authors: [{ name: "Leftover Tile Editorial Team" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Leftover Tile Project Planner",
    description:
      "Transform leftover ceramic and stone tiles into beautiful home accessories with printable $4.99 DIY project plans.",
    url: "/",
    siteName: "Leftover Tile Project Planner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leftover Tile Project Planner",
    description: "Don't discard surplus tiles. Match your inventory to architectural DIY plans.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable}`}>
      <body className="min-h-screen bg-ceramic-50 font-sans text-charcoal-900 antialiased flex flex-col selection:bg-terracotta-200 selection:text-terracotta-900">
        <Header />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <Footer />
        <MobileStickyBar />
      </body>
    </html>
  );
}
