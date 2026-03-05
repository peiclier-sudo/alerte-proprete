import { NextResponse } from "next/server";
import { getAllSectors } from "@/lib/sectors";
import { getServiceSupabase } from "@/lib/supabase";
import { BoampAnnouncement, SectorConfig } from "@/lib/types";

// Allow up to 60s on Vercel (max for hobby plan)
export const maxDuration = 60;

// ─── Config ───────────────────────────────────────────────

const BOAMP_API_URL = "https://www.boamp.fr/api/explore/v2.1/catalog/datasets/boamp/records";
const CRON_SECRET = process.env.CRON_SECRET;

// ─── Main Handler ─────────────────────────────────────────

export async function GET(request: Request) {
  // Verify cron secret (Vercel Cron)
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const sectors = getAllSectors();
  const results: Record<string, { fetched: number; inserted: number; errors: string[] }> = {};

  for (const sector of sectors) {
    try {
      // 1. Fetch from BOAMP API
      const announcements = await fetchBoampBySector(sector);

      // 2. Pre-filter: keep only announcements whose title or descriptors
      //    match at least one sector keyword (eliminates false positives from
      //    broad full-text search)
      const relevantAnnouncements = announcements.filter((a) => {
        const text = [
          a.objet,
          ...(a.descripteur_libelle ?? []),
        ].join(" ").toLowerCase();
        // Check if ALL words of a keyword appear in the text
        // (handles "entretien locaux" matching "entretien des locaux")
        const hasInclude = sector.keywordsInclude.some((kw) => {
          const words = kw.toLowerCase().split(/\s+/);
          return words.every((w) => text.includes(w));
        });
        const hasExclude = sector.keywordsExclude.some((kw) => {
          const words = kw.toLowerCase().split(/\s+/);
          return words.every((w) => text.includes(w));
        });
        return hasInclude && !hasExclude;
      });
      console.log(`[BOAMP] Sector ${sector.slug}: ${announcements.length} raw → ${relevantAnnouncements.length} after keyword filter`);

      // 3. Filter already-processed
      const existingIds = await getExistingBoampIds(supabase, relevantAnnouncements.map((a) => a.id));
      const newAnnouncements = relevantAnnouncements.filter((a) => !existingIds.has(a.id));

      // 3. Store announcements (LLM qualification deferred to /api/cron/qualify)
      let insertedCount = 0;
      const errors: string[] = [];
      for (const announcement of newAnnouncements) {
        // Build a rich title: RESUME_OBJET + descriptor labels for LLM context
        let title = announcement.objet || "";
        if (announcement.descripteur_libelle?.length && title) {
          title += ` [${announcement.descripteur_libelle.join(", ")}]`;
        } else if (announcement.descripteur_libelle?.length) {
          title = announcement.descripteur_libelle.join(", ");
        }

        const { error } = await supabase.from("opportunities").insert({
          boamp_id: announcement.id,
          sector_slug: sector.slug,
          title: title || "(sans objet)",
          buyer_name: announcement.organisme,
          buyer_department: announcement.departement,
          cpv_codes: announcement.cpv,
          deadline: parseDate(announcement.date_limite_reponse),
          publication_date: parseDate(announcement.date_publication),
          source_url: announcement.url,
          qualified: false,
          confidence: 0,
          qualification_reason: "pending",
        });
        if (error) {
          console.error(`[BOAMP] Insert error for ${announcement.id}:`, error.message);
          errors.push(`${announcement.id}: ${error.message}`);
        } else {
          insertedCount++;
        }
      }

      results[sector.slug] = {
        fetched: newAnnouncements.length,
        inserted: insertedCount,
        errors,
      };
    } catch (error) {
      console.error(`Error processing sector ${sector.slug}:`, error);
      results[sector.slug] = { fetched: 0, inserted: 0, errors: [String(error)] };
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results,
  });
}

// ─── BOAMP Fetch ──────────────────────────────────────────

async function fetchBoampBySector(sector: SectorConfig): Promise<BoampAnnouncement[]> {
  // Build a targeted search query:
  // 1. Quote multi-word phrases so they match as exact phrases
  // 2. Use only the most distinctive keywords to avoid false positives
  const quotedTerms = sector.keywordsInclude.slice(0, 7).map((kw) =>
    kw.includes(" ") ? `"${kw}"` : kw
  );
  const searchTerms = quotedTerms.join(" OR ");

  const since = new Date();
  since.setDate(since.getDate() - 7);
  const dateFilter = since.toISOString().split("T")[0];

  // Use `where` with search() on descripteur_libelle for precise filtering,
  // combined with full-text `q` as a broader fallback
  const descriptorFilter = sector.keywordsInclude
    .slice(0, 3)
    .map((kw) => `search(descripteur_libelle, "${kw}")`)
    .join(" OR ");

  const whereClause = `dateparution >= '${dateFilter}' AND (${descriptorFilter})`;

  // First try: search by descriptor labels (most precise)
  const params = new URLSearchParams({
    where: whereClause,
    limit: "30",
    order_by: "dateparution DESC",
    timezone: "Europe/Paris",
  });

  let url = `${BOAMP_API_URL}?${params}`;
  console.log(`[BOAMP] Fetching sector ${sector.slug} (descriptor search): ${url}`);

  let response = await fetch(url);
  let data: any = null;

  if (response.ok) {
    data = await response.json();
    console.log(`[BOAMP] Sector ${sector.slug} descriptor search: ${data.total_count ?? 0} total, ${(data.results ?? []).length} returned`);
  }

  // Fallback: if descriptor search returns few results, also try full-text search
  if (!data || (data.results ?? []).length < 5) {
    const fallbackParams = new URLSearchParams({
      q: searchTerms,
      where: `dateparution >= '${dateFilter}'`,
      limit: "30",
      order_by: "dateparution DESC",
      timezone: "Europe/Paris",
    });
    const fallbackUrl = `${BOAMP_API_URL}?${fallbackParams}`;
    console.log(`[BOAMP] Fallback full-text search for ${sector.slug}: ${fallbackUrl}`);

    const fallbackResponse = await fetch(fallbackUrl);
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      console.log(`[BOAMP] Sector ${sector.slug} full-text: ${fallbackData.total_count ?? 0} total, ${(fallbackData.results ?? []).length} returned`);

      // Merge results, dedup by record id
      const existing = new Set((data?.results ?? []).map((r: any) => r.id));
      const newResults = (fallbackData.results ?? []).filter((r: any) => !existing.has(r.id));
      data = data ?? { results: [] };
      data.results = [...(data.results ?? []), ...newResults];
    }
  }

  if (!data?.results?.length) {
    console.log(`[BOAMP] No results for sector ${sector.slug}`);
    return [];
  }

  // Log first raw record for debugging field mapping
  if (data.results?.length > 0) {
    const first = data.results[0];
    console.log(`[BOAMP] Sample record keys: ${Object.keys(first).join(", ")}`);
    console.log(`[BOAMP] Sample objet: ${first.objet ?? "(missing)"}`);
    console.log(`[BOAMP] Sample gestion type: ${typeof first.gestion}`);
  }

  return (data.results ?? []).map((r: any) => {
    // Parse the nested `gestion` JSON blob which contains key fields
    const gestion = parseGestion(r.gestion);
    const indexation = gestion?.INDEXATION ?? {};
    const reference = gestion?.REFERENCE ?? {};

    // Extract IDWEB: try flat field, then gestion
    const idweb = r.idweb ?? reference.IDWEB ?? r.id;

    // Extract title: try flat `objet`, then gestion RESUME_OBJET
    const objet = r.objet || indexation.RESUME_OBJET || "";

    // Extract buyer: try flat `nomacheteur`, then gestion NOMORGANISME
    const organisme = r.nomacheteur || indexation.NOMORGANISME || "";

    // Extract department: try flat `code_departement`, then gestion DEP_PUBLICATION
    const departement = r.code_departement || indexation.DEP_PUBLICATION || "";

    // Extract dates: flat fields exist for dateparution
    const datePublication = r.dateparution || indexation.DATE_PUBLICATION || "";
    const dateLimite = r.datelimitereponse || "";

    // Extract descriptors (BOAMP uses its own codes, not standard CPV)
    const descripteurCodes = parseCpv(r.descripteur_code ?? "");
    const descripteurLabels = parseDescriptorLabels(
      r.descripteur_libelle,
      indexation.DESCRIPTEURS
    );

    // Build URL
    const avisUrl = r.url_avis || r.url || `https://www.boamp.fr/avis/detail/${idweb}`;

    return {
      id: idweb,
      objet,
      organisme,
      departement,
      date_publication: datePublication,
      date_limite_reponse: dateLimite,
      cpv: descripteurCodes,
      descripteur_libelle: descripteurLabels,
      montant: r.montant ? parseFloat(r.montant) : undefined,
      url: avisUrl,
      type_marche: r.type_marche || indexation.NATURE_MARCHE || "",
      nature: r.nature ?? "",
      lots: r.lots ?? undefined,
    };
  });
}

// ─── Gestion Parsing ─────────────────────────────────────

function parseGestion(raw: any): any {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseDescriptorLabels(flatLabels: any, gestionDescripteurs: any): string[] {
  // Try flat field first (array of strings)
  if (Array.isArray(flatLabels) && flatLabels.length > 0) {
    return flatLabels;
  }
  if (typeof flatLabels === "string" && flatLabels) {
    return flatLabels.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean);
  }

  // Fall back to gestion DESCRIPTEURS
  if (!gestionDescripteurs) return [];
  const desc = gestionDescripteurs.DESCRIPTEUR;
  if (!desc) return [];
  const items = Array.isArray(desc) ? desc : [desc];
  return items.map((d: any) => d.LIBELLE ?? "").filter(Boolean);
}

function parseCpv(raw: string | string[]): string[] {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  return raw.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
}

// ─── Date Parsing ────────────────────────────────────────

function parseDate(raw: string): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

// ─── Helpers ──────────────────────────────────────────────

async function getExistingBoampIds(
  supabase: ReturnType<typeof getServiceSupabase>,
  boampIds: string[]
): Promise<Set<string>> {
  if (boampIds.length === 0) return new Set();

  const { data } = await supabase
    .from("opportunities")
    .select("boamp_id")
    .in("boamp_id", boampIds);

  return new Set((data ?? []).map((r) => r.boamp_id));
}
