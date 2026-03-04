import { getAllSectors } from "@/lib/sectors";
import SectorCard from "@/components/SectorCard";

export const metadata = {
  title: "MonMarché — Marchés publics qualifiés par IA pour les PME",
  description: "Recevez chaque matin les appels d'offres qui correspondent à votre entreprise. Qualifiés par IA, scorés, prêts à analyser.",
};

export default function HomePage() {
  const sectors = getAllSectors();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Satoshi:wght@300;400;500;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
      `}</style>
      <main style={{
        minHeight: "100vh", background: "#fcfbf9",
        fontFamily: "'Satoshi', system-ui, sans-serif", color: "#0f0f0f",
      }}>
        {/* Nav */}
        <nav style={{ borderBottom: "1px solid #e4e1db", padding: "14px 28px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: "#059669", fontStyle: "italic", letterSpacing: "-0.02em" }}>mon</span>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: "#0f0f0f", letterSpacing: "-0.02em" }}>marché</span>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "88px 28px 32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669" }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, color: "#7a7a7a", letterSpacing: "0.04em" }}>
              3 secteurs · propreté · espaces verts · sécurité
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(40px, 6vw, 68px)",
            lineHeight: 1.04, color: "#0f0f0f",
            letterSpacing: "-0.035em",
          }}>
            Marchés publics<br />qualifiés par IA,<br />
            <span style={{ color: "#059669", fontStyle: "italic" }}>chaque matin.</span>
          </h1>

          <p style={{
            fontSize: 17, lineHeight: 1.7, color: "#3d3d3d",
            maxWidth: 460, marginTop: 24, fontWeight: 400,
          }}>
            Un email quotidien avec les appels d&apos;offres qui matchent votre entreprise. Scorés de 0 à 100. Vous décidez en 2 minutes.
          </p>
        </section>

        {/* Sector Cards */}
        <section style={{ maxWidth: 920, margin: "0 auto", padding: "32px 28px 88px" }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600,
            color: "#b0b0b0", textTransform: "uppercase", letterSpacing: "0.14em",
            marginBottom: 24,
          }}>
            Choisissez votre secteur
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {sectors.map((sector, i) => (
              <SectorCard
                key={sector.slug}
                slug={sector.slug}
                emoji={sector.emoji}
                name={sector.name}
                description={`${sector.seo.description.split(".")[0]}.`}
                color={sector.landing.color}
                colorLight={sector.landing.colorLight}
                borderRadius={i === 0 ? "12px 0 0 12px" : i === 2 ? "0 12px 12px 0" : "0"}
              />
            ))}
          </div>

          {/* Waitlist */}
          <div style={{
            marginTop: 40, padding: "22px 24px",
            borderRadius: 8, border: "1px dashed #e4e1db", textAlign: "center",
          }}>
            <p style={{ fontSize: 13, color: "#7a7a7a" }}>
              Votre secteur n&apos;est pas encore disponible ?{" "}
              <a href="mailto:contact@monmarche.fr?subject=Waitlist" style={{ color: "#059669", fontWeight: 700, textDecoration: "none" }}>
                Liste d&apos;attente →
              </a>
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #e4e1db", padding: "24px 28px", display: "flex", justifyContent: "center", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 15, color: "#059669", fontStyle: "italic" }}>mon</span>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 15, color: "#0f0f0f" }}>marché</span>
          <span style={{ fontSize: 11, color: "#b0b0b0", marginLeft: 12 }}>Marchés publics · IA · PME · 2025</span>
        </footer>
      </main>
    </>
  );
}
