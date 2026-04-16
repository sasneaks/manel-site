import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Manel.k pour toute question sur nos bouquets de voiles faits main. Reponse rapide sous 24h. Disponible sur Instagram @manel.k_95.",
  openGraph: {
    title: "Contact | Manel.k – La maison des voiles",
    description:
      "Une question ? Contactez-nous pour vos bouquets de voiles personnalises.",
  },
  alternates: {
    canonical: "https://lamaisondesvoiles.fr/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
