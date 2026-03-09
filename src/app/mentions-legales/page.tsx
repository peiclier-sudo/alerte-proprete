import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales – monmarché",
};

const h1 = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700 as const, marginBottom: 32 };
const h2 = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700 as const, marginTop: 36, marginBottom: 12 };
const p = { color: "#3d3d3d", fontSize: 15, lineHeight: 1.7, marginBottom: 12 };

export default function MentionsLegales() {
  return (
    <main style={{ minHeight: "100vh", background: "#fcfbf9", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0f0f0f", padding: "80px 24px" }}>
      <article style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1 style={h1}>Mentions légales</h1>

        <h2 style={h2}>Éditeur du site</h2>
        <p style={p}>
          monmarché est édité par [Nom de la société], [forme juridique] au capital de [montant] €,
          immatriculée au RCS de [ville] sous le numéro [SIRET].<br />
          Siège social : [adresse complète]<br />
          Directeur de la publication : [nom du dirigeant]<br />
          Email : contact@monmarche.fr
        </p>

        <h2 style={h2}>Hébergement</h2>
        <p style={p}>
          Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
        </p>

        <h2 style={h2}>Propriété intellectuelle</h2>
        <p style={p}>
          L'ensemble des contenus (textes, images, graphismes, logo, icônes) présents sur ce site
          sont protégés par le droit d'auteur et le droit de la propriété intellectuelle. Toute
          reproduction, même partielle, est interdite sans autorisation préalable.
        </p>

        <h2 style={h2}>Données personnelles</h2>
        <p style={p}>
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
          d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces
          droits, contactez-nous à : contact@monmarche.fr. Pour plus d'informations, consultez
          notre <a href="/confidentialite" style={{ color: "#6366F1" }}>politique de confidentialité</a>.
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
