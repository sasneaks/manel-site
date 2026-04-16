import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique | Manel.k – La maison des voiles",
  description:
    "Parcourez notre collection de bouquets de voiles faits main. Des creations uniques et elegantes, pretes a offrir ou a personnaliser.",
};

export default function BoutiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
