import { NextRequest, NextResponse } from 'next/server'
import { scoreTenders } from '../../../../lib/scorer'

export async function GET(req: NextRequest) {
  try {
    const count = await scoreTenders()
    return NextResponse.json({ success: true, scored: count })
  } catch (error) {
    console.error('[CRON score] Erreur:', error)
    return NextResponse.json(
      { error: 'Echec du scoring', details: String(error) },
      { status: 500 }
    )
  }
}