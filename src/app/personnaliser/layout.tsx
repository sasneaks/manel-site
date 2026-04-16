import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personnaliser | Manel.k – La maison des voiles",
  description:
    "Personnalisez votre bouquet de voiles : choisissez le nombre de voiles, les couleurs et les supplements pour creer un cadeau unique et fait main.",
};

export default function PersonnaliserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
