import { NextResponse } from "next/server";
import { getSector } from "@/lib/sectors";
import { getServiceSupabase } from "@/lib/supabase";
import { buildScoringPrompt, computeTotalScore } from "@/lib/prompts";

const CRON_SECRET = process.env.CRON_SECRET;

// Normalize department codes: "075" → "75", "2A" → "2A"
function normalizeDept(dept: string | null): string {
  if (!dept) return "";
  return dept.replace(/^0+/, "") || dept;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();

  // 1. Get all active subscribers
  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .eq("active", true);

  if (!subscribers?.length) {
    return NextResponse.json({ success: true, message: "No active subscribers" });
  }

  // 2. Get all qualified opportunities not yet scored for any subscriber
  //    (include null publication_date so nothing slips through)
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const sinceDate = since.toISOString().split("T")[0];
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .eq("qualified", true)
    .or(`publication_date.gte.${sinceDate},publication_date.is.null`);

  if (!opportunities?.length) {
    return NextResponse.json({ success: true, message: "No new opportunities today" });
  }

  let totalDigests = 0;
  let totalItems = 0;
  const debug: Record<string, any> = {
    subscribers_count: subscribers.length,
    qualified_opportunities: opportunities.length,
    per_subscriber: [] as any[],
  };

  // 3. Score each opportunity for each subscriber
  for (const sub of subscribers) {
    const sector = getSector(sub.sector_slug);
    // Filter by department only — scoring rules (keywords, prestations, CPV)
    // handle sector relevance. This allows cross-sector matches (e.g. a
    // "proprete" opportunity that also covers espaces-verts).
    const subDept = normalizeDept(sub.department);
    const matchingOpps = opportunities.filter((o) => {
      const oppDept = normalizeDept(o.buyer_department);
      // Include if department matches OR if opportunity has no department set
      return !oppDept || oppDept === subDept;
    });

    const scored = matchingOpps.map((opp) => {
      const breakdown = buildScoringPrompt(sector, sub, {
        buyer_department: opp.buyer_department,
        estimated_amount: opp.estimated_amount,
        deadline: opp.deadline,
        renewal_possible: opp.renewal_possible,
        cpv_codes: opp.cpv_codes,
        title: opp.title,
        prestations: opp.prestations,
      });
      const total = computeTotalScore(breakdown);
      return { opportunity: opp, score: total, breakdown };
    });

    // Filter out low scores, sort by score desc
    const relevant = scored
      .filter((s) => s.score >= 30)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // max 10 per digest

    const subDebug: any = {
      email: sub.email,
      sector: sub.sector_slug,
      department: sub.department,
      prestations: sub.prestations,
      sector_opps_count: matchingOpps.length,
      all_scores: scored.map((s) => ({
        title: s.opportunity.title?.substring(0, 60),
        score: s.score,
        breakdown: s.breakdown,
        opp_dept: s.opportunity.buyer_department,
        opp_prestations: s.opportunity.prestations,
      })),
      above_threshold: relevant.length,
    };

    if (relevant.length === 0) {
      debug.per_subscriber.push(subDebug);
      continue;
    }

    // 4. Check which opportunities already have digest items for this subscriber
    const oppIds = relevant.map((r) => r.opportunity.id);
    const { data: existingDigests } = await supabase
      .from("digest_items")
      .select("opportunity_id")
      .eq("subscriber_id", sub.id)
      .in("opportunity_id", oppIds);
    const existingOppIds = new Set((existingDigests ?? []).map((d) => d.opportunity_id));

    const newRelevant = relevant.filter((r) => !existingOppIds.has(r.opportunity.id));
    subDebug.already_digested = existingOppIds.size;
    subDebug.new_relevant = newRelevant.length;
    debug.per_subscriber.push(subDebug);

    if (newRelevant.length === 0) continue;

    // 5. Insert digest items
    const digestItems = newRelevant.map((item) => ({
      subscriber_id: sub.id,
      opportunity_id: item.opportunity.id,
      score: item.score,
      score_breakdown: item.breakdown,
    }));

    await supabase.from("digest_items").insert(digestItems);
    totalDigests++;
    totalItems += digestItems.length;
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    digests_created: totalDigests,
    total_items: totalItems,
    debug,
  });
}
