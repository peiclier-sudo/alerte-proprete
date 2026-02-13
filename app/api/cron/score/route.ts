import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = req.headers.get('x-vercel-cron-auth-token')
  if (!cronSecret && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorise.' }, { status: 401 })
  }

  try {
    const { data: tenders, error } = await supabase
      .from('tenders')
      .select('id, title, buyer_name, buyer_dept')
      .is('relevance_score', null)
      .order('fetched_at', { ascending: true })
      .limit(20)

    if (error || !tenders || tenders.length === 0) {
      return NextResponse.json({ done: true, message: 'Tous les AO sont scores' })
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    })

    let scored = 0

    for (const tender of tenders) {
      try {
        const message = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 100,
          messages: [{ role: 'user', content: `Note cet appel d'offres de 1 a 10 pour une PME de nettoyage de locaux. Reponds UNIQUEMENT en JSON sans markdown. Titre: ${tender.title} Acheteur: ${tender.buyer_name || 'Inconnu'} Dept: ${tender.buyer_dept || 'Inconnu'} Format: {"score": X, "reason": "raison courte en francais"} Score: 8-10 nettoyage locaux, 5-7 lie au nettoyage, 1-4 pas pertinent` }],
        })

        let text = message.content[0].type === 'text' ? message.content[0].text : ''
        text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

        let parsed
        try {
          parsed = JSON.parse(text)
        } catch {
          const scoreMatch = text.match(/"score"\s*:\s*(\d+)/)
          if (scoreMatch) {
            parsed = { score: parseInt(scoreMatch[1]), reason: 'Score auto' }
          } else {
            continue
          }
        }

        await supabase
          .from('tenders')
          .update({ relevance_score: parsed.score, score_reason: parsed.reason })
          .eq('id', tender.id)

        scored++
        await new Promise(r => setTimeout(r, 500))
      } catch {
        continue
      }
    }

    return NextResponse.json({ success: true, scored })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}