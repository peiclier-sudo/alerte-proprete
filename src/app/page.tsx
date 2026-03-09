import { getAllSectors } from "@/lib/sectors";
import SectorCard from "@/components/SectorCard";
import ScrollReveal from "@/components/ScrollReveal";
import StatsCounter from "@/components/StatsCounter";
import RecentOpportunities from "@/components/RecentOpportunities";

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

        /* ── Clip-path reveal (replaces basic fade) ── */
        @keyframes mmReveal{
          from{opacity:0;transform:translateY(32px);clip-path:inset(100% 0 0 0)}
          to{opacity:1;transform:translateY(0);clip-path:inset(0 0 0 0)}
        }

        /* ── @property animated gradient ── */
        @keyframes mmGradShift{
          0%,100%{--grad-a:#6366F1;--grad-b:#A78BFA}
          33%{--grad-a:#818CF8;--grad-b:#C4B5FD}
          66%{--grad-a:#4F46E5;--grad-b:#7C3AED}
        }
        .mm-grad-text{
          background:linear-gradient(135deg,var(--grad-a),var(--grad-b));
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:mmGradShift 6s ease infinite;
        }
        .mm-grad-line{
          background:linear-gradient(90deg,var(--grad-a),var(--grad-b));
          animation:mmGradShift 6s ease infinite;
        }

        /* ── Ambient animations ── */
        @keyframes mmPulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes mmDrift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.95)}}
        @keyframes mmSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

        /* ── Breathing scroll cue ── */
        @keyframes mmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes mmBreath{
          0%{transform:scale(0.8);opacity:0.5}
          50%{transform:scale(1.6);opacity:0}
          100%{transform:scale(0.8);opacity:0.5}
        }

        /* ── Spinning border for cards ── */
        @keyframes mmBorderSpin{
          from{--border-angle:0deg}
          to{--border-angle:360deg}
        }

        /* ── Layout ── */
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
          {/* SVG noise filter definition */}
          <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </svg>

          {/* grain texture overlay */}
          <div style={{
            position: "absolute", inset: 0,
            filter: "url(#grain)",
            opacity: 0.03,
            pointerEvents: "none",
            zIndex: 1,
          }} />

          {/* refined cross-hatch grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }} />

          {/* animated gradient blob — top right */}
          <div style={{
            position: "absolute", top: "-5%", right: "-8%",
            width: "45vw", height: "45vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,.07) 0%, transparent 70%)",
            filter: "blur(120px)", pointerEvents: "none",
            animation: "mmDrift 20s ease-in-out infinite",
          }} />

          {/* animated gradient blob — bottom left */}
          <div style={{
            position: "absolute", bottom: "5%", left: "-12%",
            width: "40vw", height: "40vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,.06) 0%, transparent 70%)",
            filter: "blur(100px)", pointerEvents: "none",
            animation: "mmDrift 25s ease-in-out infinite",
            animationDelay: "-8s",
          }} />

          {/* decorative concentric rings */}
          <div style={{
            position: "absolute", top: "8%", right: "5%",
            width: 320, height: 320,
            pointerEvents: "none",
            animation: "mmSpin 60s linear infinite",
          }}>
            {[320, 220, 130].map((size, i) => (
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
            boxShadow: "0 0 24px rgba(99,102,241,0.3)",
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
            {/* headline — clip-path reveal */}
            <div style={{ animation: "mmReveal .8s cubic-bezier(0.16,1,0.3,1) .2s both" }}>
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
                <span className="mm-grad-text">échappent</span>.
              </h1>
            </div>

            {/* rule + subtitle — staggered reveal */}
            <div style={{ animation: "mmReveal .8s cubic-bezier(0.16,1,0.3,1) .5s both" }}>
              <div className="mm-grad-line" style={{
                width: 60, height: 2,
                marginTop: 32, borderRadius: 1,
              }} />
              <p style={{
                fontSize: "clamp(15px, 1.4vw, 18px)",
                lineHeight: 1.7,
                color: "#555",
                maxWidth: 480,
                marginTop: 20,
                fontWeight: 400,
              }}>
                Pendant que vous travaillez, des marchés à votre taille sont publiés — et attribués à d&apos;autres. MonMarché les détecte, les score, et vous les livre chaque matin. Vous décidez en 2&nbsp;minutes.
              </p>
            </div>

            {/* animated stats counter */}
            <StatsCounter />

            {/* recent opportunities ticker */}
            <RecentOpportunities />
          </div>

          {/* scroll cue with breathing ring */}
          <div style={{
            position: "absolute", bottom: 28, left: "50%",
            transform: "translateX(-50%)", zIndex: 2,
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8,
            animation: "mmFloat 3s ease infinite, mmReveal .6s ease 1.2s both",
          }}>
            {/* breathing ring */}
            <div style={{ position: "relative", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: "50%",
                border: "1px solid rgba(99,102,241,0.3)",
                animation: "mmBreath 3s ease infinite",
              }} />
              <div style={{ display: "flex", gap: 4 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#0EA5E9" }} />
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#EA580C" }} />
              </div>
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, color: "#bbb",
              letterSpacing: ".14em", textTransform: "uppercase",
            }}>secteurs</span>
            <span style={{ color: "#bbb", fontSize: 14 }}>↓</span>
          </div>
        </section>

        {/* ═══════ TRUST BAR ═══════ */}
        <div style={{
          borderBottom: "1px solid #e8e5df",
          padding: "16px 40px",
          display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap",
          background: "#faf9f6",
        }}>
          {[
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Données hébergées en France" },
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Conforme RGPD" },
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Résiliable en 1 clic" },
            { icon: "M5 13l4 4L19 7", label: "14 jours gratuits" },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d={icon} />
              </svg>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: "#7a7a7a",
                letterSpacing: ".03em",
              }}>{label}</span>
            </div>
          ))}
        </div>

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
            background: "radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

            {/* section header — scroll reveal */}
            <ScrollReveal>
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
                    <span className="mm-grad-text">
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
            </ScrollReveal>

            {/* cards — staggered scroll reveal */}
            <div className="mm-grid">
              {sectors.map((sector, i) => (
                <ScrollReveal key={sector.slug} delay={i * 120}>
                  <SectorCard
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
                </ScrollReveal>
              ))}
            </div>

            {/* waitlist */}
            <ScrollReveal delay={400}>
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
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════ TESTIMONIALS ═══════ */}
        <section style={{
          background: "#fff",
          padding: "72px 40px",
          borderTop: "1px solid #e8e5df",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <ScrollReveal>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, fontWeight: 500,
                  color: "#b0b0b0", textTransform: "uppercase",
                  letterSpacing: ".14em",
                }}>témoignages</span>
                <h2 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  letterSpacing: "-0.03em", fontWeight: 700,
                  marginTop: 8, color: "#0f0f0f", lineHeight: 1.1,
                }}>
                  Ils gagnent des marchés.{" "}
                  <span className="mm-grad-text">Pas du temps.</span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="mm-grid">
              {[
                {
                  quote: "On perdait 2h par jour à fouiller BOAMP. Maintenant c'est 2 minutes le matin avec mon café.",
                  role: "Responsable commercial",
                  company: "Société de nettoyage (12 sal.)",
                  region: "Île-de-France",
                  color: "#0EA5E9",
                },
                {
                  quote: "Premier marché gagné en 3 semaines. L'abonnement est remboursé pour 10 ans.",
                  role: "Gérant",
                  company: "Entreprise de gardiennage (8 sal.)",
                  region: "Rhône",
                  color: "#EA580C",
                },
                {
                  quote: "MonMarché nous envoie uniquement ce qu'on peut vraiment gagner. Fini le bruit.",
                  role: "Directrice",
                  company: "Paysagiste (6 sal.)",
                  region: "Loire-Atlantique",
                  color: "#10B981",
                },
              ].map((t, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div style={{
                    padding: "28px 24px",
                    background: "#faf9f6",
                    borderRadius: 12,
                    border: "1px solid #e8e5df",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    {/* quote mark */}
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 36, fontWeight: 700,
                      color: t.color, opacity: 0.3, lineHeight: 1,
                      marginBottom: 8,
                    }}>&ldquo;</span>
                    <p style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 14, lineHeight: 1.7, color: "#3d3d3d",
                      fontStyle: "italic", flex: 1,
                    }}>
                      {t.quote}
                    </p>
                    <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: `${t.color}15`,
                        border: `1.5px solid ${t.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 14 }}>
                          {t.color === "#0EA5E9" ? "🧹" : t.color === "#EA580C" ? "🛡" : "🌿"}
                        </span>
                      </div>
                      <div>
                        <div style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: 12, fontWeight: 600, color: "#0f0f0f",
                        }}>{t.role}</div>
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10, color: "#999",
                        }}>{t.company} · {t.region}</div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
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
