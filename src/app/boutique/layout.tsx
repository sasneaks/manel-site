import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Decouvrez notre collection de bouquets de voiles faits main : 3, 4 ou 5 voiles. Creations uniques, personnalisables et livrees en France.",
  openGraph: {
    title: "Boutique | Manel.k – La maison des voiles",
    description:
      "Bouquets de voiles faits main de 3 a 5 voiles. Choisissez votre bouquet et personnalisez-le.",
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
