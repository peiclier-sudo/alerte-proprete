import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
