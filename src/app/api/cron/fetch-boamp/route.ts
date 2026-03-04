import { NextResponse } from "next/server";
import { getAllSectors, getSectorByCpv } from "@/lib/sectors";
import { getServiceSupabase } from "@/lib/supabase";
import { buildQualificationPrompt } from "@/lib/prompts";
import { BoampAnnouncement, SectorConfig } from "@/lib/types";

// ─── Config ───────────────────────────────────────────────

const BOAMP_API_URL = "https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records";
const LLM_API_URL = process.env.LLM_API_URL ?? "https://api.deepseek.com/v1/chat/completions";
const LLM_API_KEY = process.env.LLM_API_KEY!;
const LLM_MODEL = process.env.LLM_MODEL ?? "deepseek-chat";
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

      // 3. Qualify each with LLM
      let qualifiedCount = 0;
      for (const announcement of newAnnouncements) {
        const qualification = await qualifyWithLLM(sector.slug, announcement);
        if (qualification) {
          await supabase.from("opportunities").insert({
            boamp_id: announcement.id,
            sector_slug: sector.slug,
            title: announcement.objet,
            buyer_name: announcement.organisme,
            buyer_department: announcement.departement,
            cpv_codes: announcement.cpv,
            estimated_amount: qualification.estimated_amount,
            contract_duration_months: qualification.contract_duration_months,
            deadline: announcement.date_limite_reponse,
            publication_date: announcement.date_publication,
            source_url: announcement.url,
            renewal_possible: qualification.renewal_possible ?? false,
            qualified: qualification.qualified,
            confidence: qualification.confidence,
            qualification_reason: qualification.reason,
            raw_llm_response: qualification,
          });
          if (qualification.qualified) qualifiedCount++;
        }
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
  // Build CPV filter: cpv LIKE '90910%' OR cpv LIKE '90911%' ...
  const cpvFilter = sector.cpvPrefixes
    .map((prefix) => `cpv LIKE '${prefix}%'`)
    .join(" OR ");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateFilter = yesterday.toISOString().split("T")[0];

  const params = new URLSearchParams({
    where: `(${cpvFilter}) AND date_publication >= '${dateFilter}'`,
    limit: "100",
    order_by: "date_publication DESC",
  });

  const response = await fetch(`${BOAMP_API_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`BOAMP API error: ${response.status}`);
  }

  const data = await response.json();

  return (data.results ?? []).map((r: any) => ({
    id: r.idweb ?? r.id,
    objet: r.objet ?? "",
    organisme: r.nomacheteur ?? r.organisme ?? "",
    departement: r.codedepartement ?? "",
    date_publication: r.datepublication ?? r.date_publication ?? "",
    date_limite_reponse: r.datelimiteremiseoffres ?? "",
    cpv: parseCpv(r.codecpv ?? r.cpv ?? ""),
    montant: r.montant ? parseFloat(r.montant) : undefined,
    url: `https://www.boamp.fr/avis/detail/${r.idweb ?? r.id}`,
    type_marche: r.typemarche ?? "",
    nature: r.nature ?? "",
    lots: r.lots ?? undefined,
  }));
}

function parseCpv(raw: string | string[]): string[] {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  return raw.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
}

// ─── LLM Qualification ───────────────────────────────────

async function qualifyWithLLM(
  sectorSlug: string,
  announcement: BoampAnnouncement
): Promise<Record<string, any> | null> {
  try {
    const prompt = buildQualificationPrompt(sectorSlug, announcement);

    const response = await fetch(LLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error(`LLM API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    // Parse JSON from response (handle markdown code blocks)
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(`LLM qualification failed for ${announcement.id}:`, error);
    return null;
  }
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
