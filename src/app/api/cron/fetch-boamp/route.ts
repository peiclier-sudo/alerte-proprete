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
  const results: Record<string, { fetched: number; qualified: number }> = {};

  for (const sector of sectors) {
    try {
      // 1. Fetch from BOAMP API
      const announcements = await fetchBoampBySector(sector);

      // 2. Filter already-processed
      const existingIds = await getExistingBoampIds(supabase, announcements.map((a) => a.id));
      const newAnnouncements = announcements.filter((a) => !existingIds.has(a.id));

      // 3. Store announcements (LLM qualification deferred to /api/cron/qualify)
      let qualifiedCount = 0;
      for (const announcement of newAnnouncements) {
        await supabase.from("opportunities").insert({
          boamp_id: announcement.id,
          sector_slug: sector.slug,
          title: announcement.objet,
          buyer_name: announcement.organisme,
          buyer_department: announcement.departement,
          cpv_codes: announcement.cpv,
          deadline: announcement.date_limite_reponse,
          publication_date: announcement.date_publication,
          source_url: announcement.url,
          qualified: false,
          confidence: 0,
          qualification_reason: "pending",
        });
      }

      results[sector.slug] = {
        fetched: newAnnouncements.length,
        qualified: qualifiedCount,
      };
    } catch (error) {
      console.error(`Error processing sector ${sector.slug}:`, error);
      results[sector.slug] = { fetched: 0, qualified: 0 };
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
  // Use full-text keyword search (BOAMP uses its own descriptor system, not CPV codes)
  const searchTerms = sector.keywordsInclude.slice(0, 5).join(" OR ");

  const since = new Date();
  since.setDate(since.getDate() - 7);
  const dateFilter = since.toISOString().split("T")[0];

  const params = new URLSearchParams({
    q: searchTerms,
    where: `dateparution >= '${dateFilter}'`,
    limit: "20",
    order_by: "dateparution DESC",
    timezone: "Europe/Paris",
  });

  const url = `${BOAMP_API_URL}?${params}`;
  console.log(`[BOAMP] Fetching sector ${sector.slug}: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`BOAMP API error: ${response.status} - ${body}`);
  }

  const data = await response.json();
  console.log(`[BOAMP] Sector ${sector.slug}: ${data.total_count ?? 0} total, ${(data.results ?? []).length} returned`);

  return (data.results ?? []).map((r: any) => ({
    id: r.idweb ?? r.id,
    objet: r.objet ?? "",
    organisme: r.nomacheteur ?? "",
    departement: r.code_departement ?? "",
    date_publication: r.dateparution ?? "",
    date_limite_reponse: r.datelimitereponse ?? "",
    cpv: parseCpv(r.descripteur_code ?? ""),
    montant: r.montant ? parseFloat(r.montant) : undefined,
    url: r.url_avis ?? `https://www.boamp.fr/avis/detail/${r.idweb ?? r.id}`,
    type_marche: r.type_marche ?? "",
    nature: r.nature ?? "",
    lots: r.lots ?? undefined,
  }));
}

function parseCpv(raw: string | string[]): string[] {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  return raw.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
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
