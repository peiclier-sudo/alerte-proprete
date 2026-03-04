import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonMarché — Marchés publics qualifiés par IA",
  description:
    "Recevez chaque matin les appels d'offres qui correspondent à votre entreprise. Qualifiés par IA, scorés, prêts à analyser.",
  metadataBase: new URL("https://monmarche.fr"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
