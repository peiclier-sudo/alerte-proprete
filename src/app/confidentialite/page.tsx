import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité – monmarché",
};

const h1 = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700 as const, marginBottom: 32 };
const h2 = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700 as const, marginTop: 36, marginBottom: 12 };
const p = { color: "#3d3d3d", fontSize: 15, lineHeight: 1.7, marginBottom: 12 };

export default function Confidentialite() {
  return (
    <main style={{ minHeight: "100vh", background: "#fcfbf9", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0f0f0f", padding: "80px 24px" }}>
      <article style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1 style={h1}>Politique de confidentialité</h1>

        <h2 style={h2}>1. Responsable du traitement</h2>
        <p style={p}>
          Le responsable du traitement des données est [Nom de la société], [adresse].
          Email : contact@monmarche.fr
        </p>

        <h2 style={h2}>2. Données collectées</h2>
        <p style={p}>
          Nous collectons uniquement les données nécessaires au fonctionnement du service :
          adresse email, département(s) sélectionné(s), secteur d'activité et prestations.
          Aucune donnée de navigation ni cookie de tracking n'est utilisé.
        </p>

        <h2 style={h2}>3. Finalité du traitement</h2>
        <p style={p}>
          Vos données sont utilisées exclusivement pour vous envoyer votre digest quotidien
          personnalisé de marchés publics. Elles ne sont jamais vendues ni partagées avec des tiers.
        </p>

        <h2 style={h2}>4. Base légale</h2>
        <p style={p}>
          Le traitement est fondé sur votre consentement (article 6.1.a du RGPD), recueilli lors
          de votre inscription au service.
        </p>

        <h2 style={h2}>5. Durée de conservation</h2>
        <p style={p}>
          Vos données sont conservées tant que votre compte est actif. En cas de désinscription,
          vos données sont supprimées sous 30 jours.
        </p>

        <h2 style={h2}>6. Vos droits</h2>
        <p style={p}>
          Conformément au RGPD, vous disposez des droits suivants : accès, rectification,
          suppression, portabilité, limitation et opposition au traitement. Pour exercer ces droits,
          contactez-nous à contact@monmarche.fr.
        </p>

        <h2 style={h2}>7. Sous-traitants</h2>
        <p style={p}>
          Nos sous-traitants sont : Vercel (hébergement), Supabase (base de données), Resend
          (envoi d'emails), Stripe (paiement). Tous sont conformes au RGPD.
        </p>

        <h2 style={h2}>8. Désinscription</h2>
        <p style={p}>
          Vous pouvez vous désinscrire à tout moment via le lien présent en bas de chaque email
          ou en nous contactant directement.
        </p>

        <div style={{ marginTop: 48 }}>
          <a href="/" style={{ color: "#6366F1", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            ← Retour à l'accueil
          </a>
        </div>
      </article>
    </main>
  );
}
