import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonMarché — Marchés publics qualifiés par IA",
  description:
    "Recevez chaque matin les appels d'offres qui correspondent à votre entreprise. Qualifiés par IA, scorés, prêts à analyser.",
  metadataBase: new URL("https://monmarche.fr"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "MonMarché — Les marchés publics qui vous échappent",
    description: "900+ opportunités détectées par mois. 2 min au lieu de 2h de veille. Essai gratuit 14 jours.",
    siteName: "MonMarché",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MonMarché — Les marchés publics qui vous échappent",
    description: "900+ opportunités détectées par mois. 2 min au lieu de 2h de veille. Essai gratuit 14 jours.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
