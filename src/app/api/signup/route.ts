import { NextResponse } from "next/server";
import { getSector, isSectorSlug } from "@/lib/sectors";
import { getServiceSupabase } from "@/lib/supabase";

const DEPT_REGEX = /^(\d{2,3}|2[AB])$/;

// ─── POST /api/signup ─────────────────────────────────────

export async function POST(request: Request) {
  const body = await request.json();
  const { email, sector_slug, department, prestations } = body;

  if (!email || !sector_slug || !department) {
    return NextResponse.json(
      { error: "Email, secteur et département sont requis." },
      { status: 400 }
    );
  }

  if (!isSectorSlug(sector_slug)) {
    return NextResponse.json(
      { error: "Secteur invalide." },
      { status: 400 }
    );
  }

  // Accept single string or array of departments
  const rawDepts: string[] = Array.isArray(department)
    ? department
    : [department];

  const depts = rawDepts.map((d) => String(d).trim().toUpperCase());

  // Validate all departments
  const invalid = depts.filter((d) => !DEPT_REGEX.test(d));
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: `Département(s) invalide(s) : ${invalid.join(", ")} (ex: 75, 2A, 971).` },
      { status: 400 }
    );
  }

  // Validate prestations (optional)
  let validPrestations: string[] = [];
  if (prestations && Array.isArray(prestations) && prestations.length > 0) {
    const sector = getSector(sector_slug);
    const allowed = new Set(sector.prestations);
    const invalid = prestations.filter((p: string) => !allowed.has(p));
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `Prestation(s) invalide(s) : ${invalid.join(", ")}` },
        { status: 400 }
      );
    }
    validPrestations = prestations;
  }

  // Deduplicate
  const uniqueDepts = [...new Set(depts)];

  const supabase = getServiceSupabase();

  // Check which departments already have a subscription
  const { data: existing } = await supabase
    .from("subscribers")
    .select("department")
    .eq("email", email)
    .eq("sector_slug", sector_slug)
    .in("department", uniqueDepts);

  const existingDepts = new Set((existing ?? []).map((e) => e.department));
  const newDepts = uniqueDepts.filter((d) => !existingDepts.has(d));

  if (newDepts.length === 0) {
    return NextResponse.json(
      { error: "Cet email est déjà inscrit pour ce secteur sur tous les départements demandés." },
      { status: 409 }
    );
  }

  // Insert one row per department
  const rows = newDepts.map((dept) => ({
    email,
    sector_slug,
    department: dept,
    prestations: validPrestations,
    plan: "essential",
    geo_radius_km: 50,
    active: true,
  }));

  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .insert(rows)
    .select();

  if (error) {
    console.error("Subscriber creation failed:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription." },
      { status: 500 }
    );
  }

  const skipped = uniqueDepts.length - newDepts.length;

  return NextResponse.json({
    success: true,
    subscriber_ids: subscribers.map((s) => s.id),
    sector: sector_slug,
    departments: newDepts,
    skipped_already_exists: skipped,
    message: `Inscription réussie pour ${newDepts.length} département(s) ! Votre premier digest arrive demain matin à 7h.`,
  });
}
