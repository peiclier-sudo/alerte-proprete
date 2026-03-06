import { NextResponse } from "next/server";

const BOAMP_API_URL = "https://www.boamp.fr/api/explore/v2.1/catalog/datasets/boamp/records";
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const idweb = searchParams.get("id") || "26-22856";

  // Fetch a single record by IDWEB
  const params = new URLSearchParams({
    where: `search(id, "${idweb}")`,
    limit: "1",
  });

  const url = `${BOAMP_API_URL}?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    return NextResponse.json({ error: "BOAMP API error", status: response.status }, { status: 502 });
  }

  const data = await response.json();
  const record = data.results?.[0];

  if (!record) {
    return NextResponse.json({ error: "Record not found", id: idweb }, { status: 404 });
  }

  // Parse gestion if it's a string
  let gestion = record.gestion;
  if (typeof gestion === "string") {
    try { gestion = JSON.parse(gestion); } catch { /* keep as string */ }
  }

  // Parse donnees if it's a string
  let donnees = record.donnees;
  if (typeof donnees === "string") {
    try { donnees = JSON.parse(donnees); } catch { /* keep as string */ }
  }

  return NextResponse.json({
    id: idweb,
    all_top_level_keys: Object.keys(record),
    record_raw: record,
    gestion_parsed: gestion,
    donnees_parsed: donnees,
    donnees_type: typeof record.donnees,
    donnees_keys: donnees && typeof donnees === "object" ? Object.keys(donnees) : null,
  });
}
