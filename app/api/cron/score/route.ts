import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  // Test 1: Est-ce que Supabase marche ?
  const { data: tenders, error } = await supabase
    .from('tenders')
    .select('id, title, relevance_score')
    .is('relevance_score', null)
    .limit(3)

  return NextResponse.json({
    supabase_url: process.env.SUPABASE_URL ? 'SET' : 'MISSING',
    supabase_key: process.env.SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING',
    anthropic_key: process.env.ANTHROPIC_API_KEY ? 'SET' : 'MISSING',
    error: error?.message || null,
    tenders_found: tenders?.length || 0,
    first_tender: tenders?.[0]?.title || 'aucun',
  })
}