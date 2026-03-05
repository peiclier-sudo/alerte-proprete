import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { buildQualificationPrompt } from "@/lib/prompts";
import { BoampAnnouncement } from "@/lib/types";

// Allow up to 60s on Vercel (max for hobby plan)
export const maxDuration = 60;

// ─── Config ───────────────────────────────────────────────

const LLM_API_URL = process.env.LLM_API_URL ?? "https://api.deepseek.com/v1/chat/completions";
const LLM_API_KEY = process.env.LLM_API_KEY!;
const LLM_MODEL = process.env.LLM_MODEL ?? "deepseek-chat";
const CRON_SECRET = process.env.CRON_SECRET;

// Process up to 15 records per invocation (~3-4s per LLM call = ~50s)
const BATCH_SIZE = 15;

// ─── Main Handler ─────────────────────────────────────────

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();

  // Fetch unqualified opportunities (oldest first)
  const { data: pending, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("qualification_reason", "pending")
    .eq("qualified", false)
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) {
    console.error("[Qualify] Error fetching pending opportunities:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!pending || pending.length === 0) {
    return NextResponse.json({ success: true, message: "No pending opportunities", processed: 0 });
  }

  let qualified = 0;
  let failed = 0;

  for (const opp of pending) {
    try {
      const announcement: BoampAnnouncement = {
        id: opp.boamp_id,
        objet: opp.title,
        organisme: opp.buyer_name,
        departement: opp.buyer_department,
        date_publication: opp.publication_date,
        date_limite_reponse: opp.deadline,
        cpv: opp.cpv_codes ?? [],
        montant: opp.estimated_amount ?? undefined,
        url: opp.source_url,
        type_marche: "",
        nature: "",
      };

      const result = await qualifyWithLLM(opp.sector_slug, announcement);

      if (result) {
        await supabase
          .from("opportunities")
          .update({
            qualified: result.qualified,
            confidence: result.confidence,
            qualification_reason: result.reason,
            estimated_amount: result.estimated_amount ?? opp.estimated_amount,
            contract_duration_months: result.contract_duration_months ?? null,
            renewal_possible: result.renewal_possible ?? false,
            raw_llm_response: result,
          })
          .eq("id", opp.id);

        if (result.qualified) qualified++;
      } else {
        // Mark as failed so we don't retry indefinitely
        await supabase
          .from("opportunities")
          .update({ qualification_reason: "llm_error" })
          .eq("id", opp.id);
        failed++;
      }
    } catch (err) {
      console.error(`[Qualify] Error processing ${opp.boamp_id}:`, err);
      failed++;
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    processed: pending.length,
    qualified,
    failed,
  });
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
