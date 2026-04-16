import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Manel.k – La maison des voiles",
  description:
    "Contactez Manel.k pour toute question, demande de personnalisation ou information sur nos bouquets de voiles faits main.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
