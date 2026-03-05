import { NextResponse } from "next/server";
import { getSector } from "@/lib/sectors";
import { getServiceSupabase } from "@/lib/supabase";
import { Resend } from "resend";

const CRON_SECRET = process.env.CRON_SECRET;

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();

  // 1. Get unsent digest items grouped by subscriber
  const { data: pendingItems } = await supabase
    .from("digest_items")
    .select("*, subscribers(*), opportunities(*)")
    .is("sent_at", null)
    .order("score", { ascending: false });

  if (!pendingItems?.length) {
    return NextResponse.json({ success: true, message: "No pending digests" });
  }

  // Group by subscriber
  const bySubscriber = new Map<string, typeof pendingItems>();
  for (const item of pendingItems) {
    const subId = item.subscriber_id;
    if (!bySubscriber.has(subId)) bySubscriber.set(subId, []);
    bySubscriber.get(subId)!.push(item);
  }

  let sentCount = 0;

  // 2. Send one email per subscriber
  for (const [subId, items] of bySubscriber) {
    const subscriber = items[0].subscribers;
    const sector = getSector(subscriber.sector_slug);
    const today = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const subject = sector.email.subjectTemplate
      .replace("{{count}}", String(items.length))
      .replace("{{date}}", today);

    const html = buildDigestHtml(sector, subscriber, items, today);

    try {
      await getResend().emails.send({
        from: `${sector.email.fromName} <digest@monmarche.fr>`,
        to: subscriber.email,
        subject,
        html,
      });

      // Mark as sent
      const itemIds = items.map((i) => i.id);
      await supabase
        .from("digest_items")
        .update({ sent_at: new Date().toISOString() })
        .in("id", itemIds);

      sentCount++;
    } catch (error) {
      console.error(`Failed to send digest to ${subscriber.email}:`, error);
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    emails_sent: sentCount,
  });
}

// ─── Email HTML Builder ───────────────────────────────────

function buildDigestHtml(
  sector: any,
  subscriber: any,
  items: any[],
  today: string
): string {
  const color = sector.landing.color;

  const opportunityRows = items
    .map((item) => {
      const opp = item.opportunities;
      const score = item.score;
      const scoreColor = score >= 70 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#94a3b8";
      const amount = opp.estimated_amount
        ? `${Math.round(opp.estimated_amount / 1000)}K€`
        : "N/C";
      const daysLeft = Math.ceil(
        (new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      return `
        <tr>
          <td style="padding:16px;border-bottom:1px solid #f0f0f0;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="background:${scoreColor};color:#fff;font-weight:700;font-size:18px;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${score}
              </div>
              <div style="flex:1;">
                <div style="font-weight:600;color:#111;font-size:15px;margin-bottom:4px;">
                  ${opp.title}
                </div>
                <div style="font-size:13px;color:#666;">
                  ${opp.buyer_name} · ${opp.buyer_department} · ${amount} · ${opp.contract_duration_months ? opp.contract_duration_months + " mois" : ""}
                </div>
                <div style="font-size:12px;color:${daysLeft <= 7 ? "#ef4444" : "#94a3b8"};margin-top:4px;">
                  ${daysLeft > 0 ? `${daysLeft} jours restants` : "Date limite dépassée"}
                </div>
              </div>
              <a href="${opp.source_url}" style="background:${color};color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap;">
                Voir →
              </a>
            </div>
          </td>
        </tr>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <!-- Header -->
    <div style="background:${color};border-radius:12px 12px 0 0;padding:24px;text-align:center;">
      <div style="font-size:22px;font-weight:800;color:#fff;">
        ${sector.emoji} MonMarché ${sector.shortName}
      </div>
      <div style="font-size:14px;color:rgba(255,255,255,0.8);margin-top:4px;">
        ${today}
      </div>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;">
      <p style="font-size:14px;color:#555;margin:0 0 20px;">
        ${sector.email.digestIntro}
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        ${opportunityRows}
      </table>

      <div style="text-align:center;margin-top:24px;">
        <a href="https://monmarche.fr/${sector.slug}" style="display:inline-block;background:${color};color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
          Voir tous mes marchés
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:16px;font-size:12px;color:#999;">
      MonMarché · Marchés publics qualifiés par IA<br>
      <a href="https://monmarche.fr/unsubscribe?id=${subscriber.id}" style="color:#999;">Se désinscrire</a>
    </div>
  </div>
</body>
</html>`;
}
