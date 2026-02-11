import { Resend } from 'resend'
import { supabase } from './supabase'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendDigest() {
  // Recuperer les abonnes actifs
  const { data: subscribers, error: subError } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email_enabled', true)
    .in('plan', ['trial', 'active'])

  if (subError || !subscribers || subscribers.length === 0) {
    console.log('[EMAIL] Aucun abonne actif')
    return 0
  }

  let sent = 0

  for (const sub of subscribers) {
    try {
      // Recuperer les AO bien scores pour les departements de l'abonne
      const { data: tenders, error: tError } = await supabase
        .from('tenders')
        .select('*')
        .gte('relevance_score', sub.min_score || 5)
        .in('buyer_dept', sub.departments || [])
        .order('relevance_score', { ascending: false })
        .limit(10)

      if (tError || !tenders || tenders.length === 0) {
        console.log(`[EMAIL] Aucun AO pour ${sub.email}`)
        continue
      }

      // Verifier quels AO ont deja ete envoyes
      const { data: alreadySent } = await supabase
        .from('digest_logs')
        .select('tender_id')
        .eq('subscriber_id', sub.id)

      const sentIds = new Set((alreadySent || []).map(d => d.tender_id))
      const newTenders = tenders.filter(t => !sentIds.has(t.id))

      if (newTenders.length === 0) {
        console.log(`[EMAIL] Rien de nouveau pour ${sub.email}`)
        continue
      }

      // Construire le HTML de l'email
      const tendersHtml = newTenders.map(t => `
        <div style="border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="color:#1a202c;font-size:15px;">${t.title}</strong>
            <span style="background:#48bb78;color:white;padding:2px 10px;border-radius:12px;font-size:13px;font-weight:bold;">${t.relevance_score}/10</span>
          </div>
          <p style="color:#718096;font-size:13px;margin:8px 0 4px;">
            ${t.buyer_name || 'Acheteur inconnu'} - Dept ${t.buyer_dept || '??'}
          </p>
          <p style="color:#718096;font-size:13px;margin:4px 0;">
            ${t.score_reason || ''}
          </p>
          <p style="margin:8px 0 4px;">
            ${t.deadline ? '⏰ Deadline: ' + new Date(t.deadline).toLocaleDateString('fr-FR') : ''}
          </p>
          <a href="${t.ur