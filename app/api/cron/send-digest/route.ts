import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  // Check subscribers
  const { data: subs, error: subErr } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email_enabled', true)
    .in('plan', ['trial', 'active'])

  if (!subs || subs.length === 0) {
    return NextResponse.json({ step: 'no subscribers', error: subErr?.message })
  }

  const sub = subs[0]
  const depts = sub.departments || []
  const orFilter = depts.map((d: string) => `buyer_dept.cs.{"${d}"}`).join(',')

  // Check tenders
  const { data: tenders, error: tErr } = await supabase
    .from('tenders')
    .select('id, title, relevance_score, buyer_dept')
    .gte('relevance_score', sub.min_score || 5)
    .or(orFilter)
    .limit(5)

  return NextResponse.json({
    subscriber: sub.email,
    departments: depts,
    min_score: sub.min_score,
    or_filter: orFilter,
    tenders_found: tenders?.length || 0,
    tenders_error: tErr?.message || null,
    sample: tenders?.map(t => ({ title: t.title.substring(0, 40), score: t.relevance_score, dept: t.buyer_dept })) || [],
  })
}