import Anthropic from '@anthropic-ai/sdk';
import { supabase } from './supabase';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function scoreTenders() {
  // Recuperer les AO pas encore scores
  const { data: tenders, error } = await supabase
    .from('tenders')
    .select(
      'id, title, description, buyer_name, buyer_dept, cpv_codes, estimated_amount'
    )
    .is('relevance_score', null)
    .limit(20);

  if (error || !tenders || tenders.length === 0) {
    console.log('[SCORER] Rien a scorer');
    return 0;
  }

  console.log(`[SCORER] ${tenders.length} AO a scorer`);

  let scored = 0;

  for (const tender of tenders) {
    try {
      const prompt = `Tu es un expert en marches publics de nettoyage/proprete en France.
Evalue cet appel d'offres pour une PME de nettoyage de locaux (bureaux, ecoles, hopitaux, batiments publics).

Titre: ${tender.title}
Description: ${tender.description || 'Non disponible'}
Acheteur: ${tender.buyer_name || 'Non disponible'}
Departement: ${tender.buyer_dept || 'Non disponible'}
Codes CPV: ${(tender.cpv_codes || []).join(', ')}
Montant estime: ${tender.estimated_amount || 'Non disponible'}

Reponds UNIQUEMENT avec ce format JSON exact:
{"score": X, "reason": "explication courte"}

Le score va de 1 a 10:
- 8-10: Nettoyage de locaux/batiments, tres pertinent
- 5-7: Lie au nettoyage mais pas directement locaux (voirie, espaces verts)
- 1-4: Peu pertinent (fournitures, travaux, autre secteur)`;

      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      });

      const text =
        message.content[0].type === 'text' ? message.content[0].text : '';
      const parsed = JSON.parse(text);

      await supabase
        .from('tenders')
        .update({
          relevance_score: parsed.score,
          score_reason: parsed.reason,
        })
        .eq('id', tender.id);

      console.log(
        `[SCORER] ${tender.title.substring(0, 50)}... => ${parsed.score}/10`
      );
      scored++;

      // Petite pause pour ne pas depasser les rate limits
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`[SCORER] Erreur pour ${tender.id}:`, err);
    }
  }

  return scored;
}
