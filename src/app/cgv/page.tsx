import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente – monmarché",
};

const h1 = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700 as const, marginBottom: 32 };
const h2 = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700 as const, marginTop: 36, marginBottom: 12 };
const p = { color: "#3d3d3d", fontSize: 15, lineHeight: 1.7, marginBottom: 12 };

export default function CGV() {
  return (
    <main style={{ minHeight: "100vh", background: "#fcfbf9", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0f0f0f", padding: "80px 24px" }}>
      <article style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1 style={h1}>Conditions générales de vente</h1>

        <h2 style={h2}>1. Objet</h2>
        <p style={p}>
          Les présentes conditions générales de vente régissent l'utilisation du service monmarché,
          un service de veille automatisée sur les marchés publics destiné aux entreprises du secteur
          de la propreté, des espaces verts et du gardiennage.
        </p>

        <h2 style={h2}>2. Description du service</h2>
        <p style={p}>
          monmarché analyse quotidiennement les avis de marchés publics publiés au BOAMP et envoie
          un digest personnalisé par email aux abonnés, avec un scoring de pertinence basé sur leur
          localisation, secteur d'activité et prestations.
        </p>

        <h2 style={h2}>3. Tarifs et paiement</h2>
        <p style={p}>
          L'offre Essentiel est gratuite et donne accès au digest quotidien. Les offres payantes
          sont facturées mensuellement via Stripe. Les prix sont indiqués TTC. Le paiement est dû
          à la souscription et renouvelé automatiquement chaque mois.
        </p>

        <h2 style={h2}>4. Droit de rétractation</h2>
        <p style={p}>
          Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation
          ne s'applique pas aux services pleinement exécutés avant la fin du délai de rétractation
          et dont l'exécution a commencé avec l'accord du consommateur.
        </p>

        <h2 style={h2}>5. Résiliation</h2>
        <p style={p}>
          Vous pouvez résilier votre abonnement à tout moment via le lien de désinscription
          présent dans chaque email, ou en contactant contact@monmarche.fr.
        </p>

        <h2 style={h2}>6. Responsabilité</h2>
        <p style={p}>
          monmarché s'efforce de fournir des informations fiables mais ne saurait garantir
          l'exhaustivité ou l'exactitude des données issues du BOAMP. Le service est fourni « en
          l'état ».
        </p>

        <h2 style={h2}>7. Droit applicable</h2>
        <p style={p}>
          Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux
          compétents seront ceux du siège social de l'éditeur.
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
