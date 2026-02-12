import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')

export async function POST(req: NextRequest) {
  try {
    const { email, name, company, departments } = await req.json()

    if (!email || !departments || departments.length === 0) {
      return NextResponse.json(
        { error: 'Email et departements requis' },
        { status: 400 }
      )
    }

    const { error } = await supabase
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

    // Email de bienvenue
    const deptList = departments.join(', ')
    await resend.emails.send({
      from: 'AlertePropreté <contact@alerteproprete.fr>',
      to: email,
      subject: 'Bienvenue sur AlertePropreté',
      html:
        '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;">' +
          '<h1 style="color:#111;font-size:24px;margin-bottom:16px;">Bienvenue' + (name ? ', ' + name : '') + '.</h1>' +
          '<p style="color:#555;font-size:15px;line-height:1.7;margin-bottom:20px;">' +
            'Votre essai gratuit de 14 jours est activé. Voici ce qui va se passer :' +
          '</p>' +
          '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:20px;">' +
            '<p style="color:#166534;font-size:15px;line-height:1.7;margin:0;">' +
              '<strong>Demain matin avant 6h</strong>, vous recevrez votre premier email avec les appels d\'offres de nettoyage publiés dans vos départements (' + deptList + ').' +
            '</p>' +
          '</div>' +
          '<p style="color:#555;font-size:15px;line-height:1.7;margin-bottom:20px;">' +
            'Chaque marché est évalué par pertinence pour votre activité. Vous ne verrez que ceux qui comptent.' +
          '</p>' +
          '<p style="color:#555;font-size:15px;line-height:1.7;margin-bottom:8px;">' +
            'Si vous avez la moindre question, répondez directement à cet email.' +
          '</p>' +
          '<p style="color:#555;font-size:15px;line-height:1.7;">' +
            'À demain matin,<br><strong>L\'équipe AlertePropreté</strong>' +
          '</p>' +
          '<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 16px;">' +
          '<p style="color:#999;font-size:12px;">AlertePropreté — alerteproprete.fr</p>' +
        '</div>',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[SUBSCRIBE] Erreur:', err)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}