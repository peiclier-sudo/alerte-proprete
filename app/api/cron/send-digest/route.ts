import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  // Step 1: subscribers
  const { data: subs, error: subErr } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email_enabled', true)
    .in('plan', ['trial', 'active'])

  if (!subs || subs.length === 0) {
    return NextResponse.json({ step: 'no subscribers', error: subErr?.message })
  }

  const sub = subs[0]

  // Step 2: tenders
  const depts = sub.departments || []
  const orFilter = depts.map((d: string) => `buyer_dept.like.%${d}%`).join(',')
  const { data: tenders, error: tErr } = await supabase
    .from('tenders')
    .select('*')
    .gte('relevance_score', sub.min_score || 5)
    .or(orFilter)
    .order('relevance_score', { ascending: false })
    .limit(10)

  // Step 3: digest logs
  const { data: alreadySent } = await supabase
    .from('digest_logs')
    .select('tender_id')
    .eq('subscriber_id', sub.id)

  const sentIds = new Set((alreadySent || []).map(d => d.tender_id))
  const newTenders = (tenders || []).filter(t => !sentIds.has(t.id))

  return NextResponse.json({
    subscriber: sub.email,
    plan: sub.plan,
    email_enabled: sub.email_enabled,
    departments: depts,
    filter: orFilter,
    tenders_found: tenders?.length || 0,
    tenders_error: tErr?.message || null,
    already_sent: alreadySent?.length || 0,
    new_tenders: newTenders.length,
    sample: newTenders.slice(0, 3).map(t => t.title.substring(0, 40)),
  })
}