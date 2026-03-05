import { NextResponse } from "next/server";
import { isSectorSlug } from "@/lib/sectors";
import { getServiceSupabase } from "@/lib/supabase";

// ─── POST /api/signup ─────────────────────────────────────

export async function POST(request: Request) {
  const body = await request.json();
  const { email, sector_slug, department } = body;

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

  const dept = String(department).trim().toUpperCase();
  if (!/^(\d{2,3}|2[AB])$/.test(dept)) {
    return NextResponse.json(
      { error: "Département invalide (ex: 75, 2A, 971)." },
      { status: 400 }
    );
  }

  // Create subscriber in Supabase
  const supabase = getServiceSupabase();

  // Check if already exists
  const { data: existing } = await supabase
    .from("subscribers")
    .select("id")
    .eq("email", email)
    .eq("sector_slug", sector_slug)
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
      sector_slug,
      department: dept,
      plan: "essential",
      geo_radius_km: 50,
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
    sector: sector_slug,
    department: dept,
    message: `Inscription réussie ! Votre premier digest arrive demain matin à 7h.`,
  });
}
