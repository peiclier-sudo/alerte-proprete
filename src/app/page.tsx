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
        *{margin:0;padding:0;box-sizing:border-box}
        @keyframes mmUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes mmPulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes mmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes mmDrift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.95)}}
        @keyframes mmShimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes mmSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .mm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .mm-stats{display:flex;gap:56px}
        .mm-sh{display:flex;justify-content:space-between;align-items:flex-end}
        .mm-wl{display:flex;justify-content:space-between;align-items:center}
        .mm-ft{display:flex;justify-content:space-between;align-items:center}
        a:focus-visible{outline:2px solid #6366F1;outline-offset:2px}
        @media(max-width:860px){
          .mm-grid{grid-template-columns:1fr;max-width:420px;margin:0 auto}
          .mm-stats{flex-wrap:wrap;gap:28px 40px}
          .mm-sh{flex-direction:column;align-items:flex-start;gap:20px}
          .mm-sh p{text-align:left!important}
          .mm-wl{flex-direction:column;gap:14px;text-align:center}
          .mm-ft{flex-direction:column;gap:10px;align-items:center}
        }
      `}</style>

      <main style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0f0f0f" }}>

        {/* ═══════ HERO ═══════ */}
        <section style={{
          background: "#fff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* refined cross-hatch grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.035) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }} />

          {/* animated gradient blob — top right */}
          <div style={{
            position: "absolute", top: "-5%", right: "-8%",
            width: "45vw", height: "45vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,.06) 0%, transparent 70%)",
            filter: "blur(120px)", pointerEvents: "none",
            animation: "mmDrift 20s ease-in-out infinite",
          }} />

          {/* animated gradient blob — bottom left */}
          <div style={{
            position: "absolute", bottom: "5%", left: "-12%",
            width: "40vw", height: "40vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,.05) 0%, transparent 70%)",
            filter: "blur(100px)", pointerEvents: "none",
            animation: "mmDrift 25s ease-in-out infinite",
            animationDelay: "-8s",
          }} />

          {/* decorative concentric rings */}
          <div style={{
            position: "absolute", top: "8%", right: "5%",
            width: 280, height: 280,
            pointerEvents: "none",
            animation: "mmSpin 60s linear infinite",
          }}>
            {[280, 200, 120].map((size, i) => (
              <div key={size} style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: size, height: size,
                marginTop: -size / 2, marginLeft: -size / 2,
                borderRadius: "50%",
                border: `1px solid rgba(99,102,241,${0.08 - i * 0.02})`,
              }} />
            ))}
          </div>

          {/* top accent bar with glow */}
          <div style={{
            height: 3,
            background: "linear-gradient(90deg, #6366F1 0%, #A78BFA 40%, transparent 100%)",
            position: "relative", zIndex: 2,
            boxShadow: "0 0 20px rgba(99,102,241,0.25)",
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
                fontSize: 24, color: "#6366F1",
                fontWeight: 700, letterSpacing: "-0.02em",
              }}>mon</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 24, color: "#0f0f0f",
                fontWeight: 500, letterSpacing: "-0.02em",
              }}>marché</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#6366F1", display: "inline-block",
                animation: "mmPulse 2.5s ease infinite",
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: "#999",
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
                color: "#0f0f0f",
                letterSpacing: "-0.04em",
                fontWeight: 700,
                maxWidth: 860,
              }}>
                Les marchés publics<br />
                qui vous{" "}
                <span style={{
                  background: "linear-gradient(90deg, #6366F1, #A78BFA, #6366F1)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "mmShimmer 4s ease infinite",
                }}>échappent</span>.
              </h1>
            </div>

            {/* rule + subtitle */}
            <div style={{ animation: "mmUp .7s ease .15s both" }}>
              <div style={{
                width: 60, height: 2,
                background: "linear-gradient(90deg, #6366F1, #A78BFA)",
                marginTop: 32, borderRadius: 1,
              }} />
              <p style={{
                fontSize: "clamp(15px, 1.4vw, 18px)",
                lineHeight: 1.7,
                color: "#666",
                maxWidth: 480,
                marginTop: 20,
                fontWeight: 400,
              }}>
                Pendant que vous travaillez, des marchés à votre taille sont publiés — et attribués à d&apos;autres. MonMarché les détecte, les score, et vous les livre chaque matin. Vous décidez en 2&nbsp;minutes.
              </p>
            </div>

            {/* stats with gradient numbers */}
            <div className="mm-stats" style={{ animation: "mmUp .7s ease .3s both", marginTop: 48 }}>
              {[
                { n: "900+", l: "opportunités détectées / mois" },
                { n: "2 min", l: "au lieu de 2h de veille" },
                { n: "1 marché", l: "gagné rembourse 10 ans" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 24, fontWeight: 500,
                    background: "linear-gradient(135deg, #6366F1, #A78BFA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.02em",
                  }}>{n}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, color: "#b0b0b0",
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
              fontSize: 9, color: "#ccc",
              letterSpacing: ".14em", textTransform: "uppercase",
            }}>secteurs</span>
            <span style={{ color: "#ccc", fontSize: 16 }}>↓</span>
          </div>
        </section>

        {/* ═══════ SECTORS ═══════ */}
        <section style={{
          background: "linear-gradient(180deg, #faf9f6 0%, #f0eee8 100%)",
          padding: "88px 40px 72px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* faint indigo glow at top for continuity */}
          <div style={{
            position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
            width: "60vw", height: 200, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.03) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

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
                  fontSize: "clamp(28px, 4vw, 48px)",
                  letterSpacing: "-0.03em", fontWeight: 700,
                  marginTop: 8, color: "#0f0f0f", lineHeight: 1.1,
                }}>
                  Votre secteur.{" "}<br />
                  <span style={{
                    background: "linear-gradient(135deg, #6366F1, #A78BFA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Votre avantage.
                  </span>
                </h2>
              </div>
              <p style={{
                fontSize: 13.5, color: "#999",
                maxWidth: 280, textAlign: "right", lineHeight: 1.65,
              }}>
                Une IA entraînée sur votre métier,
                pas un moteur de recherche généraliste.
              </p>
            </div>

            {/* cards */}
            <div className="mm-grid">
              {sectors.map((sector, i) => (
                <SectorCard
                  key={sector.slug}
                  slug={sector.slug}
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
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
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
        <footer style={{
          background: "#faf9f6", padding: "28px 40px",
          position: "relative",
        }}>
          {/* gradient accent line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, #6366F1, #A78BFA, transparent)",
            opacity: 0.2,
          }} />
          <div className="mm-ft" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 15, color: "#6366F1", fontWeight: 700,
              }}>mon</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 15, color: "#0f0f0f", fontWeight: 500,
              }}>marché</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: "#b0b0b0",
                letterSpacing: ".05em", marginLeft: 8,
              }}>© 2026</span>
            </div>
            <nav style={{ display: "flex", gap: 20, alignItems: "center" }}>
              {[
                { label: "Mentions légales", href: "/mentions-legales" },
                { label: "CGV", href: "/cgv" },
                { label: "Politique de confidentialité", href: "/confidentialite" },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11, color: "#b0b0b0", textDecoration: "none",
                }}>{label}</a>
              ))}
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}
