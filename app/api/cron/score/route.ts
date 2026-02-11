import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { data: tenders, error } = await supabase
      .from('tenders')
      .select('id, title, description, buyer_name, buyer_dept, cpv_codes, estimated_amount')
      .is('relevance_score', null)
      .limit(2)

    if (error || !tenders || tenders.length === 0) {
      return NextResponse.json({ step: 'no tenders', error: error?.message })
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    })

    let scored = 0

    for (const tender of tenders) {
      const prompt = `Reponds UNIQUEMENT avec du JSON, sans markdown, sans backticks.
Evalue cet appel d'offres pour une PME de nettoyage de locaux.
Titre: ${tender.title}
Acheteur: ${tender.buyer_name || 'Inconnu'}
Departement: ${tender.buyer_dept || 'Inconnu'}
Format de reponse: {"score": X, "reason": "explication"}
Score de 1 a 10 (8-10 = nettoyage locaux, 5-7 = lie au nettoyage, 1-4 = pas pertinent)`

      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      })

      let text = message.content[0].type === 'text' ? message.content[0].text : ''
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      const parsed = JSON.parse(text)

      await supabase
        .from('tenders')
        .update({ relevance_score: parsed.score, score_reason: parsed.reason })
        .eq('id', tender.id)

      scored++
    }

    return NextResponse.json({ success: true, scored })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}