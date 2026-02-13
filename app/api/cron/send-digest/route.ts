import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = req.headers.get('x-vercel-cron-auth-token')
  if (!cronSecret && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorise.' }, { status: 401 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY || '')

    const { data: subs } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email_enabled', true)
      .in('plan', ['trial', 'active'])

    if (!subs || subs.length === 0) {
      return NextResponse.json({ emails_sent: 0 })
    }

    let sent = 0

    for (const sub of subs) {
      const depts = sub.departments || []
      const orFilter = depts.map((d: string) => `buyer_dept.like.%${d}%`).join(',')

      const { data: tenders } = await supabase
        .from('tenders')
        .select('*')
        .gte('relevance_score', sub.min_score || 5)
        .or(orFilter)
        .order('relevance_score', { ascending: false })
        .limit(10)

      if (!tenders || tenders.length === 0) continue

      const { data: alreadySent } = await supabase
        .from('digest_logs')
        .select('tender_id')
        .eq('subscriber_id', sub.id)

      const sentIds = new Set((alreadySent || []).map(d => d.tender_id))
      const newTenders = tenders.filter(t => !sentIds.has(t.id))

      if (newTenders.length === 0) continue

      const tendersHtml = newTenders.map(t =>
        '<div style="border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:12px;">' +
          '<strong style="color:#1a202c;font-size:15px;">' + t.title + '</strong>' +
          '<span style="background:#059669;color:white;padding:2px 10px;border-radius:12px;font-size:13px;font-weight:bold;margin-left:8px;">' + t.relevance_score + '/10</span>' +
          '<p style="color:#718096;font-size:13px;margin:8px 0 4px;">' +
            (t.buyer_name || 'Acheteur inconnu') + ' - Dept ' + (t.buyer_dept || '??') +
          '</p>' +
          '<p style="color:#718096;font-size:13px;margin:4px 0;">' + (t.score_reason || '') + '</p>' +
          '<p style="margin:8px 0 4px;">' +
            (t.deadline ? 'Limite : ' + new Date(t.deadline).toLocaleDateString('fr-FR') : '') +
          '</p>' +
          '<a href="' + t.url + '" style="color:#059669;font-size:13px;">Voir l\'appel d\'offres</a>' +
        '</div>'
      ).join('')

      const html =
        '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">' +
          '<h1 style="color:#111;font-size:22px;">Vos marchés du jour</h1>' +
          '<p style="color:#555;">Bonjour ' + (sub.name || '') + ',<br>' +
          'Voici ' + newTenders.length + ' nouvel(s) appel(s) d\'offres de nettoyage dans vos départements.</p>' +
          tendersHtml +
          '<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">' +
          '<p style="color:#999;font-size:12px;text-align:center;">AlertePropreté — alerteproprete.fr</p>' +
        '</div>'

      const { error } = await resend.emails.send({
        from: 'AlertePropreté <contact@alerteproprete.fr>',
        to: sub.email,
        subject: newTenders.length + ' appel(s) d\'offres nettoyage',
        html,
      })

      if (!error) {
        const logs = newTenders.map(t => ({ subscriber_id: sub.id, tender_id: t.id }))
        await supabase.from('digest_logs').insert(logs)
        sent++
      }
    }

    return NextResponse.json({ success: true, emails_sent: sent })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}