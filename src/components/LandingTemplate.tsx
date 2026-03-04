"use client";

import { useState } from "react";
import Link from "next/link";
import type { SectorConfig } from "@/lib/types";

// ─── Main Component ───────────────────────────────────────

export function LandingTemplate({ config }: { config: SectorConfig }) {
  const { landing, slug, name, shortName, emoji, seo } = config;
  const color = landing.color;

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="text-xl font-extrabold" style={{ color }}>
              mon
            </span>
            <span className="text-xl font-extrabold text-gray-900">marché</span>
            <span className="text-xs font-medium text-gray-400 ml-2">
              {shortName}
            </span>
          </Link>
          <a
            href="#pricing"
            className="text-sm font-semibold px-4 py-2 rounded-lg transition"
            style={{ background: color, color: "#fff" }}
          >
            Commencer
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <div
          className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full mb-6"
          style={{ background: landing.colorLight, color: landing.colorDark }}
        >
          {emoji} {landing.socialProof.stat} {landing.socialProof.label}
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          {landing.heroQuestion}
        </h1>

        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {landing.heroSubtitle}
        </p>

        {/* Signup form */}
        <SignupForm sectorSlug={slug} color={color} />
      </section>

      {/* Pain Points */}
      <section className="py-16" style={{ background: landing.colorLight }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Avant / Après MonMarché
          </h2>
          <div className="space-y-4">
            {landing.painPoints.map((pp, i) => (
              <div
                key={i}
                className="grid md:grid-cols-2 gap-0 rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wide mb-2">
                    ❌ Aujourd&apos;hui
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {pp.before}
                  </p>
                </div>
                <div className="p-6">
                  <div
                    className="text-xs font-bold uppercase tracking-wide mb-2"
                    style={{ color }}
                  >
                    ✅ Avec MonMarché
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {pp.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Comment ça marche
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {landing.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
                  style={{ background: color }}
                >
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Tarifs simples, sans engagement
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10">
            Annulable à tout moment. Un seul marché gagné rembourse des années d&apos;abonnement.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {landing.pricing.map((tier) => (
              <div
                key={tier.name}
                className={`p-8 rounded-xl bg-white ${
                  tier.popular
                    ? "ring-2 shadow-lg relative"
                    : "border border-gray-200"
                }`}
                style={tier.popular ? { "--tw-ring-color": color } as any : {}}
              >
                {tier.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-3 py-1 rounded-full"
                    style={{ background: color }}
                  >
                    Populaire
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mt-3 mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {tier.price}€
                  </span>
                  <span className="text-gray-400 text-sm">/{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span style={{ color }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#signup"
                  className="block text-center py-3 rounded-lg font-semibold text-sm transition"
                  style={
                    tier.popular
                      ? { background: color, color: "#fff" }
                      : {
                          background: "transparent",
                          color,
                          border: `2px solid ${color}`,
                        }
                  }
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Questions fréquentes
          </h2>
          <div className="space-y-2">
            {landing.faq.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} color={color} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16" style={{ background: landing.colorDark }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {landing.ctaFinal.title}
          </h2>
          <p className="text-white/70 mb-8">{landing.ctaFinal.subtitle}</p>
          <SignupForm sectorSlug={slug} color="#fff" dark />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        <div className="flex items-baseline justify-center gap-0.5 mb-2">
          <span className="font-extrabold" style={{ color }}>
            mon
          </span>
          <span className="font-extrabold text-gray-900">marché</span>
        </div>
        Marchés publics qualifiés par IA pour les PME · 2025
      </footer>
    </main>
  );
}

// ─── Signup Form ──────────────────────────────────────────

function SignupForm({
  sectorSlug,
  color,
  dark = false,
}: {
  sectorSlug: string;
  color: string;
  dark?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [siret, setSiret] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, siret, sector_slug: sectorSlug }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ error: data.error });
      }
    } catch {
      setResult({ error: "Erreur réseau. Réessayez." });
    } finally {
      setLoading(false);
    }
  }

  if (result?.success) {
    return (
      <div
        className="mt-8 p-6 rounded-xl text-center"
        style={{ background: dark ? "rgba(255,255,255,0.1)" : "#f0fdf4" }}
      >
        <div className="text-2xl mb-2">🎉</div>
        <p className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
          {result.message}
        </p>
      </div>
    );
  }

  return (
    <div id="signup" className="mt-8 max-w-md mx-auto">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Votre SIRET (ex: 123 456 789 00012)"
          value={siret}
          onChange={(e) => setSiret(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border text-sm ${
            dark
              ? "bg-white/10 border-white/20 text-white placeholder:text-white/50"
              : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
          }`}
        />
        <input
          type="email"
          placeholder="Votre email professionnel"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border text-sm ${
            dark
              ? "bg-white/10 border-white/20 text-white placeholder:text-white/50"
              : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
          }`}
        />
        <button
          onClick={handleSubmit as any}
          disabled={loading || !email || !siret}
          className="w-full py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50"
          style={
            dark
              ? { background: "#fff", color: "#111" }
              : { background: color, color: "#fff" }
          }
        >
          {loading ? "Inscription..." : "Recevoir mon premier digest gratuit →"}
        </button>
      </div>
      {result?.error && (
        <p className="mt-3 text-sm text-red-500 text-center">{result.error}</p>
      )}
      <p
        className={`mt-3 text-xs text-center ${
          dark ? "text-white/50" : "text-gray-400"
        }`}
      >
        Gratuit 14 jours · Sans carte bancaire · Annulable en 1 clic
      </p>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────

function FaqItem({
  question,
  answer,
  color,
}: {
  question: string;
  answer: string;
  color: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
      >
        <span className="font-semibold text-gray-900 text-sm pr-4">
          {question}
        </span>
        <span
          className="text-lg transition-transform flex-shrink-0"
          style={{ color, transform: open ? "rotate(45deg)" : "rotate(0)" }}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
