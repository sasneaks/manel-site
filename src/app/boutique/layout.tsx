import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Découvrez notre collection de bouquets de voiles faits main : 3, 4 ou 5 voiles. Créations uniques, personnalisables et livrées en France.",
  openGraph: {
    title: "Boutique | Manel.k – La maison des voiles",
    description:
      "Bouquets de voiles faits main de 3 à 5 voiles. Choisissez votre bouquet et personnalisez-le.",
  },
  alternates: {
    canonical: "https://lamaisondesvoiles.fr/boutique",
  },
};

export default function BoutiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
