import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export async function GET(req: NextRequest) {
  // Test 1: chercher les tenders non scores
  const { data: tenders, error } = await supabase
    .from('tenders')
    .select('id, title, description, buyer_name, buyer_dept, cpv_codes, estimated_amount')
    .is('relevance_score', null)
    .limit(1)

  if (error || !tenders || tenders.length === 0) {
    return NextResponse.json({ 
      step: 'supabase', 
      error: error?.message || 'no tenders found',
      count: tenders?.length || 0 
    })
  }

  // Test 2: appeler Claude Haiku
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder',
    })

    const tender = tenders[0]
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{ role: 'user', content: 'Reponds juste avec {"score": 8, "reason": "test"}' }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({
      step: 'anthropic OK',
      tender_title: tender.title,
      claude_response: text,
    })
  } catch (err) {
    return NextResponse.json({
      step: 'anthropic FAILED',
      error: String(err),
    })
  }
}