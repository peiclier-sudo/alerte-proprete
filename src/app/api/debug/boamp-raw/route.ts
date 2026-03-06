import { NextResponse } from "next/server";

const BOAMP_API_URL = "https://www.boamp.fr/api/explore/v2.1/catalog/datasets/boamp/records";
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "propreté nettoyage";
  const id = searchParams.get("id");

  let params: URLSearchParams;

  if (id) {
    // Search by specific ID field
    params = new URLSearchParams({
      where: `idweb = '${id}'`,
      limit: "1",
    });
  } else {
    // Full-text search for recent records
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
    params = new URLSearchParams({
      q: query,
      where: `dateparution >= '${thirtyDaysAgo}'`,
      limit: "3",
      order_by: "dateparution DESC",
      timezone: "Europe/Paris",
    });
  }

  const url = `${BOAMP_API_URL}?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: "BOAMP API error", status: response.status, body: text }, { status: 502 });
  }

  const data = await response.json();
  const records = data.results ?? [];

  if (records.length === 0) {
    return NextResponse.json({ error: "No records found", query, url }, { status: 404 });
  }

  // Parse and return all records with full detail
  const parsed = records.map((record: any) => {
    let gestion = record.gestion;
    if (typeof gestion === "string") {
      try { gestion = JSON.parse(gestion); } catch { /* keep as string */ }
    }

    let donnees = record.donnees;
    if (typeof donnees === "string") {
      try { donnees = JSON.parse(donnees); } catch { /* keep as string */ }
    }

    return {
      top_level_keys: Object.keys(record),
      record_raw: record,
      gestion_parsed: gestion,
      gestion_keys: gestion && typeof gestion === "object" ? Object.keys(gestion) : null,
      donnees_parsed: donnees,
      donnees_type: typeof record.donnees,
      donnees_keys: donnees && typeof donnees === "object" ? Object.keys(donnees) : null,
    };
  });

  return NextResponse.json({
    total_count: data.total_count,
    returned: records.length,
    api_url: url,
    records: parsed,
  });
}
