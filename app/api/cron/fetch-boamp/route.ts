import { NextRequest, NextResponse } from 'next/server'
import { fetchBoampTenders } from '../../../../lib/boamp'

export async function GET(req: NextRequest) {
  // AUTH DESACTIVEE POUR TEST
  // const authHeader = req.headers.get('authorization')
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json(
  //     { error: 'Non autorise. Header Authorization requis.' },
  //     { status: 401 }
  //   )
  // }

  try {
    const startTime = Date.now()
    const count = await fetchBoampTenders()
    const duration = ((Date.now() - startTime) / 1000).toFixed(1)

    return NextResponse.json({
      success: true,
      count,
      duration: `${duration}s`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[CRON fetch-boamp] Erreur:', error)
    return NextResponse.json(
      { error: 'Echec de la recuperation BOAMP' },
      { status: 500 }
    )
  }
}