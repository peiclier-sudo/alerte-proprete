import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from('tenders')
    .select('id, title')
    .is('relevance_score', null)
    .limit(3)

  return NextResponse.json({
    url_set: !!process.env.SUPABASE_URL,
    url_value: process.env.SUPABASE_URL?.substring(0, 20) || 'EMPTY',
    error: error?.message || null,
    found: data?.length || 0,
    titles: data?.map(t => t.title) || [],
  })
}