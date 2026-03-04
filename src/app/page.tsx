import Link from "next/link";
import { getAllSectors } from "@/lib/sectors";

export const metadata = {
  title: "MonMarché — Marchés publics qualifiés par IA pour les PME",
  description:
    "Recevez chaque matin les appels d'offres qui correspondent à votre entreprise. Qualifiés par IA, scorés, prêts à analyser. Pour les PME de propreté, espaces verts et sécurité.",
};

export default function HomePage() {
  const sectors = getAllSectors();

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-extrabold text-emerald-600">mon</span>
            <span className="text-xl font-extrabold text-gray-900">marché</span>
          </div>
          <a
            href="#sectors"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition"
          >
            Choisir mon secteur
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Les marchés publics de votre secteur,
          <br />
          <span className="text-emerald-600">qualifiés par IA</span>, dans votre boîte mail.
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          Choisissez votre secteur. On s&apos;occupe du reste : détection, qualification, scoring. Vous ouvrez votre email, vous décidez.
        </p>
      </section>

      {/* Sector Cards */}
      <section id="sectors" className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {sectors.map((sector) => (
            <Link
              key={sector.slug}
              href={`/${sector.slug}`}
              className="group block p-8 rounded-xl border-2 border-gray-100 hover:border-current transition-all duration-200 text-center"
              style={
                {
                  "--tw-border-opacity": 1,
                  color: sector.landing.color,
                } as any
              }
            >
              <div className="text-4xl mb-4">{sector.emoji}</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-current transition">
                {sector.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                {sector.seo.description.split(".")[0]}.
              </p>
              <div
                className="inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2"
                style={{ color: sector.landing.color }}
              >
                Découvrir
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Waitlist */}
        <div className="mt-12 text-center py-8 px-6 rounded-xl bg-gray-50">
          <p className="text-sm text-gray-500">
            Votre secteur n&apos;est pas encore disponible ?{" "}
            <a
              href="mailto:contact@monmarche.fr?subject=Waitlist%20-%20Nouveau%20secteur"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Inscrivez-vous à la liste d&apos;attente
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        <div className="flex items-baseline justify-center gap-0.5 mb-2">
          <span className="font-extrabold text-emerald-600">mon</span>
          <span className="font-extrabold text-gray-900">marché</span>
        </div>
        Marchés publics qualifiés par IA pour les PME · 2025
      </footer>
    </main>
  );
}
