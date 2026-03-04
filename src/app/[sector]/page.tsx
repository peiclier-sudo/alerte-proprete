import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSectorSlugs, getSector, isSectorSlug } from "@/lib/sectors";
import { LandingTemplate } from "@/components/LandingTemplate";

// ─── Static Generation ────────────────────────────────────

export function generateStaticParams() {
  return getAllSectorSlugs().map((slug) => ({ sector: slug }));
}

// ─── Dynamic SEO ──────────────────────────────────────────

export function generateMetadata({
  params,
}: {
  params: { sector: string };
}): Metadata {
  if (!isSectorSlug(params.sector)) return {};
  const sector = getSector(params.sector);
  return {
    title: sector.seo.title,
    description: sector.seo.description,
    keywords: sector.seo.keywords,
    openGraph: {
      title: sector.seo.title,
      description: sector.seo.description,
      type: "website",
      url: `https://monmarche.fr/${sector.slug}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────

export default function SectorPage({
  params,
}: {
  params: { sector: string };
}) {
  if (!isSectorSlug(params.sector)) notFound();
  const sector = getSector(params.sector);
  return <LandingTemplate config={sector} />;
}
