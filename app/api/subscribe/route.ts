import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, name, company, departments } = await req.json()

    if (!email || !departments || departments.length === 0) {
      return NextResponse.json(
        { error: 'Email et departements requis' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('subscribers')
      .upsert({
        email,
        name: name || null,
        company: company || null,
        departments,
        plan: 'trial',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: 'email',
      })

    if (error) {
      console.error('[SUBSCRIBE] Erreur:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}