import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { data: tenders, error } = await supabase
      .from('tenders')
      .select('id, title, description, buyer_name, buyer_dept, cpv_codes, estimated_amount')
      .is('relevance_score', null)
      .limit(20)

    if (error || !tenders || tenders.length === 0) {
      return NextResponse.json({ step: 'no tenders', error: error?.message })
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    })

    let scored = 0
    let errors = 0

    for (const tender of tenders) {
      try {
        const prompt = `Score this cleaning tender 1-10 for a cleaning company. Reply ONLY with JSON, no markdown.
Title: ${tender.title}
Buyer: ${tender.buyer_name || 'Unknown'}
Dept: ${tender.buyer_dept || 'Unknown'}
Reply format: {"score": X, "reason": "short reason"}`

        const message = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 100,
          messages: [{ role: 'user', content: prompt }],
        })

        let text = message.content[0].type === 'text' ? message.content[0].text : ''
        text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
        
        const jsonMatch = text.match(/\{[^}]+\}/)
        if (!jsonMatch) {
          errors++
          continue
        }

        const parsed = JSON.parse(jsonMatch[0])

        await supabase
          .from('tenders')
          .update({ relevance_score: parsed.score, score_reason: parsed.reason })
          .eq('id', tender.id)

        scored++
        await new Promise(r => setTimeout(r, 300))
      } catch (err) {
        errors++
      }
    }

    return NextResponse.json({ success: true, scored, errors })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}