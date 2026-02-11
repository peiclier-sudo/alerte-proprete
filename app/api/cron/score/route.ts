import { NextRequest, NextResponse } from 'next/server'
import { scoreTenders } from '../../../../lib/scorer'

export async function GET(req: NextRequest) {
  // AUTH DESACTIVEE POUR TEST
  // const authHeader = req.headers.get('authorization')
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json(
  //     { error: 'Non autorise.' },
  //     { status: 401 }
  //   )
  // }

  try {
    const count = await scoreTenders()
    return NextResponse.json({ success: true, scored: count })
  } catch (error) {
    console.error('[CRON score] Erreur:', error)
    return NextResponse.json(
      { error: 'Echec du scoring' },
      { status: 500 }
    )
  }
}