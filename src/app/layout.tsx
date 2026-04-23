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
  title: {
    default: "Manel.k \u2013 La maison des voiles | Bouquets de voiles faits main",
    template: "%s | Manel.k \u2013 La maison des voiles",
  },
  description:
    "Bouquets de voiles faits main et personnalisables. Choisissez vos couleurs et offrez un cadeau qui change des fleurs classiques. Livraison en France.",
  keywords: [
    "bouquet de voiles",
    "cadeau fait main",
    "bouquet personnalisé",
    "cadeau original",
    "voiles",
    "hijab bouquet",
    "cadeau mariage",
    "cadeau anniversaire",
    "fait main France",
    "Manel.k",
    "la maison des voiles",
  ],
  authors: [{ name: "Manel.k" }],
  creator: "Manel.k",
  openGraph: {
    title: "Manel.k \u2013 La maison des voiles",
    description:
      "Bouquets de voiles faits main et personnalisables. Choisissez vos couleurs et offrez un cadeau unique.",
    siteName: "La Maison des Voiles",
    locale: "fr_FR",
    type: "website",
    url: "https://lamaisondesvoiles.fr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manel.k \u2013 La maison des voiles",
    description:
      "Bouquets de voiles faits main et personnalisables. Choisissez vos couleurs et offrez un cadeau unique.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://lamaisondesvoiles.fr",
  },
  icons: {
    icon: "/icon.png?v=2",
    apple: "/apple-icon.png?v=2",
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
