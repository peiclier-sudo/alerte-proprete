"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { SectorConfig } from "@/lib/types";

export function LandingTemplate({ config }: { config: SectorConfig }) {
  const { landing, slug, shortName } = config;
  const c = landing.color;
  const [sharedSiret, setSharedSiret] = useState("");

  return (
    <>
      <style jsx global>{`
        :root {
          --c: ${c};
          --cl: ${landing.colorLight};
          --cd: ${landing.colorDark};
          --ink: #0f0f0f;
          --ink2: #3d3d3d;
          --ink3: #7a7a7a;
          --ink4: #b0b0b0;
          --bg: #fcfbf9;
          --bg2: #f4f2ee;
          --line: #e4e1db;
          --serif: 'Space Grotesk', system-ui, sans-serif;
          --body: 'Plus Jakarta Sans', system-ui, sans-serif;
          --mono: 'JetBrains Mono', monospace;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { font-family: var(--body); color: var(--ink); background: var(--bg); }
        ::selection { background: ${c}25; }
        .fade-up {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-up.in { opacity: 1; transform: none; }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* Focus styles */
        input:focus, button:focus-visible, a:focus-visible {
          outline: 2px solid ${c};
          outline-offset: 2px;
        }

        /* ── Responsive ──────────────────────────── */
        @media (max-width: 860px) {
          .lp-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .lp-hero-cards { display: none !important; }
          .lp-pain-row { grid-template-columns: 1fr !important; }
          .lp-pain-divider { display: none !important; }
          .lp-steps-grid { grid-template-columns: 1fr !important; }
          .lp-steps-grid > div > div { border-radius: 12px !important; }
          .lp-pricing-grid { grid-template-columns: 1fr !important; }
          .lp-pricing-grid > div > div { border-radius: 12px !important; }
          .lp-metrics { gap: 28px 40px !important; }
          .lp-nav-links { display: none !important; }
          .lp-nav-cta { font-size: 12px !important; padding: 8px 14px !important; }
        }
        @media (max-width: 480px) {
          .lp-hero-input { flex-direction: column !important; }
        }
      `}</style>

      <main>
        <TopBar shortName={shortName} color={c} />
        <HeroSection landing={landing} sharedSiret={sharedSiret} setSharedSiret={setSharedSiret} />
        <MetricsRibbon />
        <ProblemSection painPoints={landing.painPoints} color={c} />
        <ProcessSection steps={landing.steps} color={c} />
        <DigestPreview color={c} shortName={shortName} />
        <PricingSection pricing={landing.pricing} color={c} />
        <FaqSection faq={landing.faq} color={c} />
        <CtaSection cta={landing.ctaFinal} slug={slug} color={c} colorDark={landing.colorDark} sharedSiret={sharedSiret} />
        <FooterBar color={c} />
      </main>
    </>
  );
}

/* ── Observer hook ──────────────────────────────── */
function useFade() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); o.disconnect(); } }, { threshold: 0.1 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return ref;
}
function F({ children, delay = 0, as = "div", style = {} }: { children: React.ReactNode; delay?: number; as?: string; style?: React.CSSProperties }) {
  const ref = useFade();
  return <div ref={ref} className="fade-up" style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}

/* ── Top Bar ────────────────────────────────────── */
function TopBar({ shortName, color }: { shortName: string; color: string }) {
  const [sc, setSc] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 40); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 99,
      background: sc ? "rgba(252,251,249,0.88)" : "transparent",
      backdropFilter: sc ? "blur(16px) saturate(1.4)" : "none",
      borderBottom: sc ? "1px solid var(--line)" : "1px solid transparent",
      transition: "all 0.35s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 24, color, fontWeight: 700, letterSpacing: "-0.02em" }}>mon</span>
          <span style={{ fontFamily: "var(--serif)", fontSize: 24, color: "var(--ink)", letterSpacing: "-0.02em" }}>marché</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 600, color: "var(--ink4)", marginLeft: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>{shortName}</span>
        </Link>
        <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="#process" className="lp-nav-links" style={{ fontFamily: "var(--body)", fontSize: 13, color: "var(--ink3)", textDecoration: "none", fontWeight: 500, letterSpacing: "0.01em" }}>Comment</a>
          <a href="#pricing" className="lp-nav-links" style={{ fontFamily: "var(--body)", fontSize: 13, color: "var(--ink3)", textDecoration: "none", fontWeight: 500 }}>Tarifs</a>
          <a href="#start" className="lp-nav-cta" style={{
            fontFamily: "var(--body)", fontSize: 13, fontWeight: 700, color: "#fff",
            background: color, padding: "9px 20px", borderRadius: 6, textDecoration: "none",
            letterSpacing: "0.01em",
          }}>Essai gratuit</a>
        </nav>
      </div>
    </header>
  );
}

/* ── Hero ───────────────────────────────────────── */
function HeroSection({ landing, sharedSiret, setSharedSiret }: { landing: SectorConfig["landing"]; sharedSiret: string; setSharedSiret: (v: string) => void }) {
  const c = landing.color;
  return (
    <section style={{ borderBottom: "1px solid var(--line)" }}>
      <div className="lp-hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 28px 56px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 60, alignItems: "center" }}>
        {/* Left — text */}
        <div>
          <F>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, animation: "pulse-dot 2.4s infinite" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500, color: "var(--ink3)", letterSpacing: "0.04em" }}>
                {landing.socialProof.stat} {landing.socialProof.label}
              </span>
            </div>
          </F>
          <F delay={60}>
            <h1 style={{
              fontFamily: "var(--serif)", fontSize: "clamp(40px, 5.2vw, 62px)",
              lineHeight: 1.05, color: "var(--ink)", letterSpacing: "-0.03em",
              maxWidth: 580,
            }}>
              {landing.heroQuestion}
            </h1>
          </F>
          <F delay={130}>
            <p style={{
              fontFamily: "var(--body)", fontSize: 17, lineHeight: 1.7, color: "var(--ink2)",
              maxWidth: 480, marginTop: 24, fontWeight: 400,
            }}>
              {landing.heroSubtitle}
            </p>
          </F>
          <F delay={200}>
            <div className="lp-hero-input" style={{ marginTop: 36, display: "flex", gap: 10, maxWidth: 440 }}>
              <input type="text" placeholder="Votre SIRET" value={sharedSiret} onChange={e => setSharedSiret(e.target.value)} style={{
                flex: 1, padding: "13px 14px", borderRadius: 6, border: "1.5px solid var(--line)",
                fontFamily: "var(--mono)", fontSize: 13, background: "#fff", color: "var(--ink)", outline: "none",
                transition: "border 0.2s",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = c}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--line)"}
              />
              <a href="#start" style={{
                padding: "13px 22px", borderRadius: 6, background: c, color: "#fff",
                fontFamily: "var(--body)", fontSize: 14, fontWeight: 700, textDecoration: "none",
                whiteSpace: "nowrap",
              }}>Démarrer →</a>
            </div>
            <p style={{ fontFamily: "var(--body)", fontSize: 12, color: "var(--ink4)", marginTop: 10 }}>
              14 jours gratuits · Sans CB · Résiliable en 1 clic
            </p>
          </F>
        </div>

        {/* Right — mock score cards */}
        <F delay={250}>
          <div className="lp-hero-cards" style={{ position: "relative" }}>
            {[
              { score: 94, title: "Entretien locaux — Mairie de Lyon", meta: "180K€ · 36 mois · 76", days: 21, top: 0 },
              { score: 76, title: "Maintenance bâtiments communaux", meta: "95K€ · 24 mois · 45", days: 14, top: 108 },
              { score: 61, title: "Prestations de service — Évreux", meta: "55K€ · 36 mois · 27", days: 6, top: 216 },
            ].map((card, i) => (
              <div key={i} style={{
                position: i === 0 ? "relative" : "relative",
                marginTop: i > 0 ? 12 : 0,
                padding: "18px 20px", borderRadius: 10,
                background: "#fff", border: "1px solid var(--line)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                display: "flex", gap: 14, alignItems: "center",
                transform: `translateX(${i * -8}px)`,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 10, flexShrink: 0,
                  background: card.score >= 80 ? `${c}10` : card.score >= 60 ? "#fef9ee" : "#f8f8f8",
                  border: `2px solid ${card.score >= 80 ? c : card.score >= 60 ? "#e5a820" : "#d4d4d4"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: 18, fontWeight: 600,
                    color: card.score >= 80 ? c : card.score >= 60 ? "#b8860b" : "#888",
                  }}>{card.score}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--body)", fontSize: 13, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {card.title}
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink3)", marginTop: 3 }}>
                    {card.meta}
                  </div>
                </div>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600,
                  color: card.days <= 7 ? "#c0392b" : "var(--ink4)",
                  whiteSpace: "nowrap",
                }}>{card.days}j</div>
              </div>
            ))}
            {/* Decorative blur */}
            <div style={{
              position: "absolute", bottom: -20, left: 20, right: 20, height: 40,
              background: `linear-gradient(to bottom, transparent, var(--bg))`,
              pointerEvents: "none",
            }} />
          </div>
        </F>
      </div>
    </section>
  );
}

/* ── Metrics Ribbon ─────────────────────────────── */
function MetricsRibbon() {
  const items = [
    { val: "7h00", lbl: "envoi quotidien" },
    { val: "< 2 min", lbl: "temps de lecture" },
    { val: "100%", lbl: "AO qualifiés IA" },
    { val: "0,002€", lbl: "coût par analyse" },
  ];
  return (
    <div style={{
      borderBottom: "1px solid var(--line)", padding: "18px 28px",
      display: "flex", justifyContent: "center", gap: 56, flexWrap: "wrap",
    }} className="lp-metrics">
      {items.map((it, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{it.val}</div>
          <div style={{ fontFamily: "var(--body)", fontSize: 11, color: "var(--ink4)", marginTop: 2, letterSpacing: "0.02em" }}>{it.lbl}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Problem / Pain Points ──────────────────────── */
function ProblemSection({ painPoints, color }: { painPoints: SectorConfig["landing"]["painPoints"]; color: string }) {
  return (
    <section style={{ maxWidth: 920, margin: "0 auto", padding: "72px 28px" }}>
      <F>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.14em" }}>Le problème</p>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(30px, 4vw, 44px)", color: "var(--ink)", marginTop: 10, lineHeight: 1.1, letterSpacing: "-0.025em", maxWidth: 500 }}>
          Vous perdez des marchés.<br /><span style={{ color: "var(--ink3)", fontStyle: "italic" }}>Pas par incompétence.</span>
        </h2>
      </F>

      <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 1 }}>
        {painPoints.map((pp, i) => (
          <F key={i} delay={i * 80}>
            <div className="lp-pain-row" style={{
              display: "grid", gridTemplateColumns: "1fr 1px 1fr", background: "#fff",
              borderRadius: i === 0 ? "12px 12px 0 0" : i === painPoints.length - 1 ? "0 0 12px 12px" : 0,
              border: "1px solid var(--line)", borderTop: i > 0 ? "none" : undefined,
            }}>
              <div style={{ padding: "24px 28px" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 600, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Sans MonMarché</span>
                <p style={{ fontFamily: "var(--body)", fontSize: 14, lineHeight: 1.65, color: "var(--ink2)", marginTop: 8 }}>{pp.before}</p>
              </div>
              <div className="lp-pain-divider" style={{ background: `linear-gradient(to bottom, var(--line), ${color}40, var(--line))` }} />
              <div style={{ padding: "24px 28px" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.1em" }}>Avec MonMarché</span>
                <p style={{ fontFamily: "var(--body)", fontSize: 14, lineHeight: 1.65, color: "var(--ink)", marginTop: 8, fontWeight: 500 }}>{pp.after}</p>
              </div>
            </div>
          </F>
        ))}
      </div>
    </section>
  );
}

/* ── Process / How it works ─────────────────────── */
function ProcessSection({ steps, color }: { steps: SectorConfig["landing"]["steps"]; color: string }) {
  return (
    <section id="process" style={{ background: "var(--cl)", padding: "72px 28px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <F>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.14em" }}>Fonctionnement</p>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(30px, 4vw, 44px)", color: "var(--ink)", marginTop: 10, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Trois étapes.<br />Deux minutes.
          </h2>
        </F>

        <div className="lp-steps-grid" style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {steps.map((s, i) => (
            <F key={i} delay={i * 100}>
              <div style={{
                padding: "36px 28px", background: "#fff",
                borderRadius: i === 0 ? "12px 0 0 12px" : i === 2 ? "0 12px 12px 0" : 0,
                border: "1px solid var(--line)",
                height: "100%",
              }}>
                <div style={{
                  fontFamily: "var(--serif)", fontSize: 56, fontWeight: 700,
                  color, opacity: 0.2, lineHeight: 1, marginBottom: 16,
                }}>{String(i + 1).padStart(2, "0")}</div>
                <h3 style={{ fontFamily: "var(--body)", fontSize: 17, fontWeight: 900, color: "var(--ink)", marginBottom: 10, letterSpacing: "-0.01em" }}>{s.title}</h3>
                <p style={{ fontFamily: "var(--body)", fontSize: 14, lineHeight: 1.7, color: "var(--ink3)", fontWeight: 400 }}>{s.description}</p>
              </div>
            </F>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Digest Preview ─────────────────────────────── */
function DigestPreview({ color, shortName }: { color: string; shortName: string }) {
  return (
    <section style={{ padding: "72px 28px", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <F>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.14em", textAlign: "center" }}>Aperçu</p>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, color: "var(--ink)", marginTop: 10, lineHeight: 1.1, letterSpacing: "-0.025em", textAlign: "center" }}>
            Ce que vous recevez à 7h
          </h2>
        </F>

        <F delay={100}>
          <div style={{
            marginTop: 36, background: "#fff", borderRadius: 14, overflow: "hidden",
            boxShadow: "0 12px 48px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.03)",
            border: "1px solid var(--line)",
          }}>
            {/* Email header */}
            <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: color }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--body)", fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>MonMarché {shortName}</div>
                <div style={{ fontFamily: "var(--body)", fontSize: 11, color: "var(--ink4)" }}>3 marchés · lundi 3 mars</div>
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>7:00</span>
            </div>
            {/* Items */}
            {[
              { score: 94, t: "Entretien locaux administratifs — Mairie de Rouen", m: "Ville de Rouen · 76 · 180K€ · 36 mois", d: 21, renew: true },
              { score: 76, t: "Maintenance bâtiments communaux", m: "CC Cœur de Loire · 45 · 95K€ · 24 mois", d: 14, renew: false },
              { score: 61, t: "Prestations — Groupe scolaire Voltaire", m: "Ville d'Évreux · 27 · 55K€ · 36 mois", d: 6, renew: true },
            ].map((r, i, a) => (
              <div key={i} style={{ padding: "16px 22px", borderBottom: i < a.length - 1 ? "1px solid #f0efeb" : "none", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 8, flexShrink: 0,
                  background: r.score >= 80 ? `${color}0d` : r.score >= 60 ? "#fdf6e3" : "#f8f8f6",
                  border: `1.5px solid ${r.score >= 80 ? color : r.score >= 60 ? "#daa520" : "#ccc"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 16, fontWeight: 600, color: r.score >= 80 ? color : r.score >= 60 ? "#b8860b" : "#999" }}>{r.score}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--body)", fontSize: 13, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.t}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink3)", marginTop: 3, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span>{r.m}</span>
                    {r.renew && <span style={{ color }}>↻ reconduction</span>}
                  </div>
                </div>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600, color: r.d <= 7 ? "#c0392b" : "var(--ink4)" }}>{r.d}j</span>
              </div>
            ))}
          </div>
        </F>
      </div>
    </section>
  );
}

/* ── Pricing ────────────────────────────────────── */
function PricingSection({ pricing, color }: { pricing: SectorConfig["landing"]["pricing"]; color: string }) {
  return (
    <section id="pricing" style={{ padding: "72px 28px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <F>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.14em" }}>Tarifs</p>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, color: "var(--ink)", marginTop: 10, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Simple. Sans engagement.
          </h2>
          <p style={{ fontFamily: "var(--body)", fontSize: 14, color: "var(--ink3)", marginTop: 10 }}>
            Un seul marché gagné rembourse des années d&apos;abonnement.
          </p>
        </F>

        <div className="lp-pricing-grid" style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {pricing.map((t, i) => (
            <F key={t.name} delay={i * 80}>
              <div style={{
                padding: "36px 32px", borderRadius: i === 0 ? "12px 0 0 12px" : "0 12px 12px 0",
                background: t.popular ? "var(--cl)" : "#fff",
                border: t.popular ? `1.5px solid ${color}40` : "1px solid var(--line)",
                position: "relative", height: "100%", display: "flex", flexDirection: "column",
              }}>
                {t.popular && <div style={{ position: "absolute", top: 0, left: 28, right: 28, height: 2, background: color, borderRadius: "0 0 2px 2px" }} />}
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
                  color: t.popular ? color : "var(--ink4)",
                }}>{t.name}{t.popular ? " · recommandé" : ""}</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3, margin: "18px 0 28px" }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 44, color: "var(--ink)", letterSpacing: "-0.03em" }}>{t.price}€</span>
                  <span style={{ fontFamily: "var(--body)", fontSize: 13, color: "var(--ink4)" }}>/{t.period}</span>
                </div>
                <div style={{ flex: 1 }}>
                  {t.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 12, fontFamily: "var(--body)", fontSize: 13, lineHeight: 1.5, color: "var(--ink2)" }}>
                      <span style={{ color, flexShrink: 0 }}>✓</span><span>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#start" style={{
                  display: "block", textAlign: "center", padding: "13px 20px", borderRadius: 8,
                  fontFamily: "var(--body)", fontSize: 14, fontWeight: 700, textDecoration: "none", marginTop: 20,
                  ...(t.popular ? { background: color, color: "#fff" } : { background: "transparent", color, border: `1.5px solid ${color}` }),
                }}>{t.cta}</a>
              </div>
            </F>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────── */
function FaqSection({ faq, color }: { faq: SectorConfig["landing"]["faq"]; color: string }) {
  return (
    <section style={{ padding: "72px 28px", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <F><h2 style={{ fontFamily: "var(--serif)", fontSize: 32, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 36 }}>Questions fréquentes</h2></F>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {faq.map((f, i) => <F key={i} delay={i * 50}><Accordion q={f.question} a={f.answer} color={color} /></F>)}
        </div>
      </div>
    </section>
  );
}

function Accordion({ q, a, color }: { q: string; a: string; color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 8, border: "1px solid var(--line)", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 14,
      }}>
        <span style={{ fontFamily: "var(--body)", fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.5 }}>{q}</span>
        <span style={{
          fontSize: 18, color: "var(--ink4)", transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          transform: open ? "rotate(45deg)" : "none", flexShrink: 0,
        }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 500 : 0, overflow: "hidden", transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ padding: "0 22px 18px", fontFamily: "var(--body)", fontSize: 13, lineHeight: 1.8, color: "var(--ink2)" }}>{a}</div>
      </div>
    </div>
  );
}

/* ── Final CTA ──────────────────────────────────── */
function CtaSection({ cta, slug, color, colorDark, sharedSiret }: { cta: SectorConfig["landing"]["ctaFinal"]; slug: string; color: string; colorDark: string; sharedSiret: string }) {
  const [email, setEmail] = useState(""); const [siret, setSiret] = useState(sharedSiret);
  useEffect(() => { if (sharedSiret) setSiret(sharedSiret); }, [sharedSiret]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  async function submit() {
    if (!email || !siret) return; setLoading(true); setResult(null);
    try {
      const r = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, siret, sector_slug: slug }) });
      const d = await r.json();
      r.ok ? setResult({ success: true, message: d.message }) : setResult({ error: d.error });
    } catch { setResult({ error: "Erreur réseau." }); } finally { setLoading(false); }
  }

  return (
    <section id="start" style={{ background: "var(--cl)", padding: "72px 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, right: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${color}10 0%, transparent 70%)` }} />
      <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <F>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.5vw, 38px)", color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>{cta.title}</h2>
          <p style={{ fontFamily: "var(--body)", fontSize: 15, color: "var(--ink3)", marginTop: 14, fontWeight: 400 }}>{cta.subtitle}</p>
        </F>
        {result?.success ? (
          <F><div style={{ marginTop: 32, background: "#fff", borderRadius: 10, padding: 24, border: "1px solid var(--line)" }}>
            <p style={{ fontFamily: "var(--body)", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{result.message}</p>
          </div></F>
        ) : (
          <F delay={80}>
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 8 }}>
              <input type="text" placeholder="SIRET (ex: 123 456 789 00012)" value={siret} onChange={e => setSiret(e.target.value)}
                style={{ padding: "13px 14px", borderRadius: 8, border: "1.5px solid var(--line)", background: "#fff", fontFamily: "var(--mono)", fontSize: 13, color: "var(--ink)", outline: "none" }} />
              <input type="email" placeholder="Email professionnel" value={email} onChange={e => setEmail(e.target.value)}
                style={{ padding: "13px 14px", borderRadius: 8, border: "1.5px solid var(--line)", background: "#fff", fontFamily: "var(--body)", fontSize: 14, color: "var(--ink)", outline: "none" }} />
              <button onClick={submit} disabled={loading || !email || !siret}
                style={{ padding: "14px", borderRadius: 8, background: color, color: "#fff", fontFamily: "var(--body)", fontSize: 14, fontWeight: 900, border: "none", cursor: "pointer", opacity: loading ? 0.5 : 1, letterSpacing: "-0.01em" }}>
                {loading ? "..." : cta.buttonText}
              </button>
            </div>
            {result?.error && <p style={{ fontFamily: "var(--body)", fontSize: 12, color: "#f87171", marginTop: 10 }}>{result.error}</p>}
            <p style={{ fontFamily: "var(--body)", fontSize: 11, color: "var(--ink4)", marginTop: 12 }}>14 jours gratuits · Sans CB · Résiliable en 1 clic</p>
          </F>
        )}
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────── */
function FooterBar({ color }: { color: string }) {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "24px 28px", display: "flex", justifyContent: "center", alignItems: "baseline", gap: 4 }}>
      <span style={{ fontFamily: "var(--serif)", fontSize: 15, color, fontWeight: 700 }}>mon</span>
      <span style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--ink)" }}>marché</span>
      <span style={{ fontFamily: "var(--body)", fontSize: 11, color: "var(--ink4)", marginLeft: 12 }}>Marchés publics · IA · PME · 2026</span>
    </footer>
  );
}
