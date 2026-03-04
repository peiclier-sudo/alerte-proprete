import { getAllSectors } from "@/lib/sectors";
import SectorCard from "@/components/SectorCard";

export const metadata = {
  title: "MonMarché — Marchés publics qualifiés par IA pour les PME",
  description:
    "Recevez chaque matin les appels d'offres qui correspondent à votre entreprise. Qualifiés par IA, scorés, prêts à analyser.",
};

export default function HomePage() {
  const sectors = getAllSectors();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        @keyframes mmUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes mmPulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes mmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .mm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .mm-stats{display:flex;gap:56px}
        .mm-sh{display:flex;justify-content:space-between;align-items:flex-end}
        .mm-wl{display:flex;justify-content:space-between;align-items:center}
        .mm-ft{display:flex;justify-content:space-between;align-items:center}
        @media(max-width:860px){
          .mm-grid{grid-template-columns:1fr;max-width:420px;margin:0 auto}
          .mm-stats{flex-wrap:wrap;gap:28px 40px}
          .mm-sh{flex-direction:column;align-items:flex-start;gap:20px}
          .mm-sh p{text-align:left!important}
          .mm-wl{flex-direction:column;gap:14px;text-align:center}
          .mm-ft{flex-direction:column;gap:10px;align-items:center}
        }
      `}</style>

      <main style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* ═══════ HERO ═══════ */}
        <section style={{
          background: "#09090b",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* dot grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }} />

          {/* top accent */}
          <div style={{
            height: 2,
            background: "linear-gradient(90deg, #6366F1 0%, #A78BFA 40%, transparent 100%)",
            position: "relative", zIndex: 2,
          }} />

          {/* nav */}
          <nav style={{
            padding: "24px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 24, color: "#818CF8",
                fontWeight: 700, letterSpacing: "-0.02em",
              }}>mon</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 24, color: "#fafafa",
                fontWeight: 500, letterSpacing: "-0.02em",
              }}>marché</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#818CF8", display: "inline-block",
                animation: "mmPulse 2.5s ease infinite",
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: "rgba(255,255,255,.32)",
                letterSpacing: ".06em",
              }}>veille active</span>
            </div>
          </nav>

          {/* hero body */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 40px 100px",
            maxWidth: 1100, width: "100%", margin: "0 auto",
            position: "relative", zIndex: 2,
          }}>
            {/* headline */}
            <div style={{ animation: "mmUp .7s ease both" }}>
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(44px, 7vw, 84px)",
                lineHeight: 1.02,
                color: "#fafafa",
                letterSpacing: "-0.04em",
                fontWeight: 700,
                maxWidth: 860,
              }}>
                Les marchés publics<br />
                qui vous{" "}
                <span style={{
                  background: "linear-gradient(135deg, #818CF8, #C084FC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>correspondent</span>.
              </h1>
            </div>

            {/* rule + subtitle */}
            <div style={{ animation: "mmUp .7s ease .15s both" }}>
              <div style={{
                width: 40, height: 2,
                background: "linear-gradient(90deg, #6366F1, #A78BFA)",
                marginTop: 32, borderRadius: 1,
              }} />
              <p style={{
                fontSize: "clamp(15px, 1.4vw, 18px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,.42)",
                maxWidth: 480,
                marginTop: 20,
                fontWeight: 400,
              }}>
                Chaque matin, un email avec les appels d&apos;offres scorés
                par IA pour votre activité. De 0 à 100. Vous décidez en
                2&nbsp;minutes.
              </p>
            </div>

            {/* stats */}
            <div className="mm-stats" style={{ animation: "mmUp .7s ease .3s both", marginTop: 48 }}>
              {[
                { n: "900+", l: "marchés analysés / mois" },
                { n: "<2 min", l: "pour décider" },
                { n: "100 %", l: "des sources couvertes" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 24, fontWeight: 500,
                    color: "#818CF8", letterSpacing: "-0.02em",
                  }}>{n}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, color: "rgba(255,255,255,.25)",
                    letterSpacing: ".05em", marginTop: 6,
                  }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* scroll cue */}
          <div style={{
            position: "absolute", bottom: 28, left: "50%",
            transform: "translateX(-50%)", zIndex: 2,
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8,
            animation: "mmFloat 3s ease infinite, mmUp .6s ease 1s both",
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0EA5E9" }} />
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981" }} />
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#EA580C" }} />
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, color: "rgba(255,255,255,.18)",
              letterSpacing: ".14em", textTransform: "uppercase",
            }}>secteurs</span>
            <span style={{ color: "rgba(255,255,255,.18)", fontSize: 16 }}>↓</span>
          </div>

          {/* ambient glow */}
          <div style={{
            position: "absolute", top: "12%", right: "-10%",
            width: "50vw", height: "50vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,.06) 0%, transparent 70%)",
            filter: "blur(80px)", pointerEvents: "none",
          }} />
        </section>

        {/* ═══════ SECTORS ═══════ */}
        <section style={{ background: "#faf9f6", padding: "88px 40px 72px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>

            {/* section header */}
            <div className="mm-sh" style={{ marginBottom: 52 }}>
              <div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, fontWeight: 500,
                  color: "#b0b0b0", textTransform: "uppercase",
                  letterSpacing: ".14em",
                }}>secteurs</span>
                <h2 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(26px, 3.5vw, 42px)",
                  letterSpacing: "-0.03em", fontWeight: 700,
                  marginTop: 8, color: "#0f0f0f", lineHeight: 1.1,
                }}>
                  Trois verticales,<br />
                  <span style={{ color: "#6366F1" }}>
                    une obsession.
                  </span>
                </h2>
              </div>
              <p style={{
                fontSize: 13.5, color: "#999",
                maxWidth: 280, textAlign: "right", lineHeight: 1.65,
              }}>
                Chaque secteur a son IA dédiée, ses critères
                de scoring, ses certifications.
              </p>
            </div>

            {/* cards */}
            <div className="mm-grid">
              {sectors.map((sector, i) => (
                <SectorCard
                  key={sector.slug}
                  slug={sector.slug}
                  emoji={sector.emoji}
                  name={sector.name}
                  description={`${sector.seo.description.split(".")[0]}.`}
                  color={sector.landing.color}
                  colorLight={sector.landing.colorLight}
                  colorDark={sector.landing.colorDark}
                  index={i}
                  stat={sector.landing.socialProof.stat}
                  statLabel={sector.landing.socialProof.label}
                />
              ))}
            </div>

            {/* waitlist */}
            <div className="mm-wl" style={{
              marginTop: 48, padding: "18px 28px",
              borderRadius: 10, border: "1px solid #e8e5df",
              background: "#fff",
            }}>
              <p style={{ fontSize: 13.5, color: "#999" }}>
                Votre secteur n&apos;est pas encore disponible&nbsp;?
              </p>
              <a
                href="mailto:contact@monmarche.fr?subject=Waitlist"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, fontWeight: 500,
                  color: "#6366F1", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                Rejoindre la liste d&apos;attente <span>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="mm-ft" style={{
          background: "#09090b", padding: "28px 40px",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15, color: "#818CF8", fontWeight: 700,
            }}>mon</span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15, color: "#fafafa", fontWeight: 500,
            }}>marché</span>
          </div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: "rgba(255,255,255,.22)",
            letterSpacing: ".05em",
          }}>
            marchés publics · ia · pme · 2026
          </span>
        </footer>
      </main>
    </>
  );
}
