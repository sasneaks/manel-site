import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lamaisondesvoiles.fr"),
  title: "Manel.k \u2013 La maison des voiles",
  description:
    "Des bouquets de voiles faits main pour offrir un cadeau unique et plein d\u2019\u00e9motion.",
  openGraph: {
    title: "Manel.k \u2013 La maison des voiles",
    description:
      "Des bouquets de voiles faits main pour offrir un cadeau unique et plein d\u2019\u00e9motion.",
    siteName: "La Maison des Voiles",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manel.k \u2013 La maison des voiles",
    description:
      "Des bouquets de voiles faits main pour offrir un cadeau unique et plein d\u2019\u00e9motion.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        {/* Spacer for fixed navbar */}
        <div className="h-16 md:h-20" />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
