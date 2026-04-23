import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personnaliser votre bouquet",
  description:
    "Créez votre bouquet de voiles sur mesure : nombre de voiles, couleurs, suppléments et message cadeau. Livraison en France ou retrait sur place.",
  openGraph: {
    title: "Personnaliser | Manel.k – La maison des voiles",
    description:
      "Créez votre bouquet de voiles personnalisé en quelques étapes.",
  },
  alternates: {
    canonical: "https://lamaisondesvoiles.fr/personnaliser",
  },
};

export default function PersonnaliserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
