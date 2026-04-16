import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personnaliser votre bouquet",
  description:
    "Creez votre bouquet de voiles sur mesure : nombre de voiles, couleurs, supplements et message cadeau. Livraison en France ou retrait sur place.",
  openGraph: {
    title: "Personnaliser | Manel.k – La maison des voiles",
    description:
      "Creez votre bouquet de voiles personnalise en quelques etapes.",
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
