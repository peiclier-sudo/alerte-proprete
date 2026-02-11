import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  try {
    // Debug: compter les non-scores
    const { count } = await supabase
      .from('tenders')
      .select('*', { count: 'exact', head: true })
      .is('relevance_score', null)

    const { data: tenders, error } = await supabase
      .from('tenders')
      .select('id, title, buyer_name, buyer_dept')
      .is('relevance_score', null)
      .limit(5)

    if (error) {
      return NextResponse.json({ error: error.message })
    }

    return NextResponse.json({
      total_not_scored: count,
      fetched: tenders?.length || 0,
      sample: tenders?.map(t => ({ id: t.id, title: t.title.substring(0, 40) })) || [],
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}