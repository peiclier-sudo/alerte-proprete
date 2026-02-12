import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AlertePropreté — Veille marchés publics de nettoyage',
  description: 'Recevez chaque matin les appels d\'offres de nettoyage dans vos départements, scorés par pertinence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}