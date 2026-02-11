// src/lib/boamp.ts
// Récupère les appels d'offres de nettoyage depuis l'API BOAMP (gratuite)
// Utilise le paramètre "refine" sur le descripteur métier (testé et validé)

import { supabase } from './supabase';

// URL de base de l'API BOAMP (hébergée sur Opendatasoft)
const BOAMP_API =
  'https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records';

// Descripteurs métier pertinents pour le nettoyage
const DESCRIPTEURS_NETTOYAGE = [
  'Nettoyage de locaux',
  'Nettoyage de bâtiments',
  'Services de voirie et de collecte des déchets', // inclut parfois nettoyage urbain
];

// Interface pour typer les données BOAMP
interface BoampRecord {
  idweb?: string;
  id?: string;
  objet?: string;
  nomacheteur?: string;
  denomination?: string;
  code_departement?: string;
  code_dept?: string;
  dateparution?: string;
  datelimitereponse?: string;
  datefindiffusion?: string;
  url_avis?: string;
  descripteur_libelle?: string;
  descripteur_code_cpv?: string;
  nature?: string;
  famille?: string;
  donnees?: any; // Données structurées complètes
}

/**
 * Récupère les AO de nettoyage publiés récemment sur le BOAMP
 * Utilise le descripteur métier "Nettoyage de locaux" pour un filtrage précis
 */
export async function fetchBoampTenders(): Promise<number> {
  // Calculer la date de début (7 jours en arrière pour être sûr de ne rien rater)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const dateStr = startDate.toISOString().split('T')[0];

  let totalInserted = 0;

  // Boucler sur chaque descripteur pertinent
  for (const descripteur of DESCRIPTEURS_NETTOYAGE) {
    try {
      // Construire l'URL avec le paramètre refine (plus fiable que search)
      const url = new URL(BOAMP_API);
      url.searchParams.set('where', `dateparution>'${dateStr}'`);
      url.searchParams.set('refine', `descripteur_libelle:${descripteur}`);
      url.searchParams.set('limit', '100');
      url.searchParams.set('order_by', 'dateparution DESC');

      console.log(`[BOAMP] Fetching: ${descripteur}...`);

      const res = await fetch(url.toString());

      if (!res.ok) {
        console.error(`[BOAMP] HTTP ${res.status} pour "${descripteur}"`);
        continue;
      }

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        console.log(`[BOAMP] 0 résultat pour "${descripteur}"`);
        continue;
      }

      console.log(
        `[BOAMP] ${data.results.length} résultats pour "${descripteur}"`
      );

      // Mapper les résultats vers notre format
      const tenders = data.results.map((r: BoampRecord) => {
        // Extraire l'ID unique
        const sourceId =
          r.idweb || r.id || `boamp_${Date.now()}_${Math.random()}`;

        // Extraire le nom de l'acheteur (plusieurs champs possibles)
        const buyerName = r.nomacheteur || r.denomination || null;

        // Extraire le département (plusieurs champs possibles)
        const buyerDept = r.code_departement || r.code_dept || null;

        // Extraire les codes CPV
        const cpvCodes = r.descripteur_code_cpv
          ? r.descripteur_code_cpv
              .split(';')
              .map((c: string) => c.trim())
              .filter(Boolean)
          : [];

        // Extraire la deadline (date limite de réponse)
        const deadline = r.datelimitereponse || r.datefindiffusion || null;

        // Construire l'URL de l'avis
        const avisUrl =
          r.url_avis || `https://www.boamp.fr/avis/detail/${sourceId}`;

        // Extraire le montant si présent dans les données structurées
        let amount: string | null = null;
        if (r.donnees) {
          try {
            const donnees =
              typeof r.donnees === 'string' ? JSON.parse(r.donnees) : r.donnees;
            // Chercher le montant dans les données structurées
            if (donnees?.GESTION?.MONTANT) {
              amount = donnees.GESTION.MONTANT.toString();
            }
          } catch {
            // Pas grave si on ne peut pas parser
          }
        }

        return {
          source: 'boamp' as const,
          source_id: sourceId.toString(),
          title: r.objet || 'Sans titre',
          description: r.descripteur_libelle || descripteur,
          buyer_name: buyerName,
          buyer_dept: buyerDept,
          cpv_codes: cpvCodes.length > 0 ? cpvCodes : ['90910000'],
          deadline: deadline,
          url: avisUrl,
          estimated_amount: amount,
          published_at: r.dateparution || null,
          raw_data: r, // Garder les données brutes pour debug
        };
      });

      // Upsert dans Supabase (ignore les doublons grâce à UNIQUE)
      if (tenders.length > 0) {
        const { error, count } = await supabase
          .from('tenders')
          .upsert(tenders, {
            onConflict: 'source,source_id',
            ignoreDuplicates: true,
          });

        if (error) {
          console.error(`[BOAMP] Erreur Supabase:`, error.message);
        } else {
          totalInserted += tenders.length;
          console.log(
            `[BOAMP] ${tenders.length} AO insérés/mis à jour pour "${descripteur}"`
          );
        }
      }
    } catch (err) {
      console.error(`[BOAMP] Erreur pour "${descripteur}":`, err);
    }
  }

  console.log(`[BOAMP] Total: ${totalInserted} AO traités`);
  return totalInserted;
}
