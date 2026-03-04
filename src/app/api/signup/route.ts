import { NextResponse } from "next/server";
import { getSectorByNaf, isSectorSlug } from "@/lib/sectors";
import { getServiceSupabase } from "@/lib/supabase";

// ─── POST /api/signup ─────────────────────────────────────

export async function POST(request: Request) {
  const body = await request.json();
  const { email, siret, sector_slug } = body;

  if (!email || !siret) {
    return NextResponse.json(
      { error: "Email et SIRET requis" },
      { status: 400 }
    );
  }

  // 1. Lookup SIRET via API SIRENE (INSEE)
  const companyInfo = await lookupSiret(siret.replace(/\s/g, ""));
  if (!companyInfo) {
    return NextResponse.json(
      { error: "SIRET introuvable. Vérifiez le numéro." },
      { status: 404 }
    );
  }

  // 2. Determine sector from NAF code or explicit selection
  let resolvedSector = sector_slug;
  if (!resolvedSector || !isSectorSlug(resolvedSector)) {
    const detected = getSectorByNaf(companyInfo.nafCode);
    if (detected) {
      resolvedSector = detected.slug;
    } else {
      return NextResponse.json(
        {
          error: "Votre secteur n'est pas encore couvert par MonMarché.",
          naf_code: companyInfo.nafCode,
          company_name: companyInfo.name,
        },
        { status: 422 }
      );
    }
  }

  // 3. Create subscriber in Supabase
  const supabase = getServiceSupabase();

  // Check if already exists
  const { data: existing } = await supabase
    .from("subscribers")
    .select("id")
    .eq("email", email)
    .eq("sector_slug", resolvedSector)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Cet email est déjà inscrit pour ce secteur." },
      { status: 409 }
    );
  }

  const { data: subscriber, error } = await supabase
    .from("subscribers")
    .insert({
      email,
      siret: siret.replace(/\s/g, ""),
      company_name: companyInfo.name,
      sector_slug: resolvedSector,
      naf_code: companyInfo.nafCode,
      plan: "essential",
      department: companyInfo.department,
      geo_lat: companyInfo.lat,
      geo_lng: companyInfo.lng,
      geo_radius_km: 50, // default
      active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Subscriber creation failed:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    subscriber_id: subscriber.id,
    company_name: companyInfo.name,
    sector: resolvedSector,
    message: `Bienvenue ${companyInfo.name} ! Votre premier digest arrive demain matin.`,
  });
}

// ─── SIRENE API Lookup ────────────────────────────────────

interface CompanyInfo {
  name: string;
  nafCode: string;
  department: string;
  lat: number;
  lng: number;
}

async function lookupSiret(siret: string): Promise<CompanyInfo | null> {
  try {
    // API SIRENE (open data, no auth required for basic lookup)
    const response = await fetch(
      `https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`,
      {
        headers: {
          Accept: "application/json",
          // Bearer token for INSEE API — set in env
          ...(process.env.INSEE_API_TOKEN
            ? { Authorization: `Bearer ${process.env.INSEE_API_TOKEN}` }
            : {}),
        },
      }
    );

    if (!response.ok) {
      // Fallback: use entreprise.data.gouv.fr (no auth)
      return await lookupSiretFallback(siret);
    }

    const data = await response.json();
    const etab = data.etablissement;
    const unite = etab.uniteLegale;

    return {
      name:
        unite.denominationUniteLegale ??
        `${unite.prenomUsuelUniteLegale ?? ""} ${unite.nomUniteLegale ?? ""}`.trim(),
      nafCode: etab.uniteLegale?.activitePrincipaleUniteLegale ?? "",
      department: etab.adresseEtablissement?.codeCommuneEtablissement?.substring(0, 2) ?? "",
      lat: parseFloat(etab.adresseEtablissement?.coordonneeLambertAbscisseEtablissement ?? "0"),
      lng: parseFloat(etab.adresseEtablissement?.coordonneeLambertOrdonneeEtablissement ?? "0"),
    };
  } catch (error) {
    console.error("SIRENE lookup failed:", error);
    return await lookupSiretFallback(siret);
  }
}

async function lookupSiretFallback(siret: string): Promise<CompanyInfo | null> {
  try {
    const response = await fetch(
      `https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${siret}`
    );
    if (!response.ok) return null;

    const data = await response.json();
    const etab = data.etablissement;

    return {
      name: etab.unite_legale?.denomination ?? etab.unite_legale?.nom_raison_sociale ?? "Entreprise",
      nafCode: etab.unite_legale?.activite_principale ?? "",
      department: etab.code_postal?.substring(0, 2) ?? "",
      lat: parseFloat(etab.latitude ?? "0"),
      lng: parseFloat(etab.longitude ?? "0"),
    };
  } catch {
    return null;
  }
}
