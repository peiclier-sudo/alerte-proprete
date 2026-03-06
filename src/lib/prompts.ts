import { getSector } from "./sectors";
import { BoampAnnouncement, SectorConfig } from "./types";

// ─── Qualification Prompt ─────────────────────────────────

export function buildQualificationPrompt(
  sectorSlug: string,
  announcement: BoampAnnouncement
): string {
  const sector = getSector(sectorSlug);

  const descripteurs = announcement.descripteur_libelle?.length
    ? `Descripteurs BOAMP : ${announcement.descripteur_libelle.join(", ")}`
    : "Descripteurs : non renseignés";

  const prestationsList = sector.prestations.length
    ? `\n\nIdentifie aussi les types de prestations concernées parmi cette liste UNIQUEMENT : [${sector.prestations.join(", ")}]. Retourne-les dans le champ "prestations" du JSON.`
    : "";

  return `${sector.qualificationPrompt}${prestationsList}

---

Voici l'avis de marché à analyser :

Objet : ${announcement.objet}
Organisme : ${announcement.organisme}
Département : ${announcement.departement}
Date de publication : ${announcement.date_publication}
Date limite de réponse : ${announcement.date_limite_reponse}
${descripteurs}
${announcement.cpv.length > 0 ? `Codes descripteurs : ${announcement.cpv.join(", ")}` : ""}
${announcement.montant ? `Montant estimé : ${announcement.montant}€` : "Montant non communiqué"}
Type de marché : ${announcement.type_marche}
${
  announcement.lots
    ? `Lots :\n${announcement.lots.map((l) => `  - Lot ${l.numero}: ${l.intitule} (CPV: ${l.cpv?.join(", ") ?? "non précisé"})`).join("\n")}`
    : "Pas d'allotissement"
}

Réponds UNIQUEMENT en JSON valide, sans aucun texte avant ou après.`;
}

// ─── Scoring Prompt ───────────────────────────────────────

export function buildScoringPrompt(
  sector: SectorConfig,
  subscriber: { department: string; geo_radius_km: number; prestations?: string[] },
  opportunity: {
    buyer_department: string;
    estimated_amount: number | null;
    deadline: string;
    renewal_possible: boolean;
    cpv_codes: string[];
    title?: string;
    prestations?: string[];
  }
): Record<string, number> {
  const rules = sector.scoringRules;
  const scores: Record<string, number> = {};

  // Sector match: check BOAMP descriptor codes against CPV prefixes,
  // OR check if title/descriptors contain sector keywords
  const cpvMatch = opportunity.cpv_codes.some((cpv) =>
    sector.cpvPrefixes.some((prefix) => cpv.startsWith(prefix))
  );
  const titleLower = (opportunity.title ?? "").toLowerCase();
  const keywordMatch = sector.keywordsInclude.some((kw) =>
    titleLower.includes(kw.toLowerCase())
  );
  // Opportunities are already LLM-qualified for this sector, so give
  // full points if CPV or keyword matches, otherwise 60% (LLM already approved)
  scores.cpvMatch = cpvMatch || keywordMatch
    ? rules.cpvMatch
    : Math.round(rules.cpvMatch * 0.6);

  // Size match
  const amount = opportunity.estimated_amount;
  if (amount) {
    const { min, max } = sector.typicalContractRange;
    if (amount >= min && amount <= max) {
      scores.sizeMatch = rules.sizeMatch;
    } else if (amount < min * 0.5 || amount > max * 2) {
      scores.sizeMatch = 0;
    } else {
      scores.sizeMatch = Math.round(rules.sizeMatch * 0.5);
    }
  } else {
    scores.sizeMatch = Math.round(rules.sizeMatch * 0.6); // neutral
  }

  // Renewal bonus
  scores.renewalBonus = opportunity.renewal_possible ? rules.renewalBonus : 0;

  // Deadline urgency (bonus if > 15 days, penalty if < 5 days)
  const deadlineMs = opportunity.deadline ? new Date(opportunity.deadline).getTime() : NaN;
  if (isNaN(deadlineMs)) {
    // Unknown deadline — give neutral score so it doesn't penalize
    scores.deadlineUrgency = Math.round(rules.deadlineUrgency * 0.6);
  } else {
    const daysLeft = Math.ceil((deadlineMs - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft > 15) {
      scores.deadlineUrgency = rules.deadlineUrgency;
    } else if (daysLeft > 5) {
      scores.deadlineUrgency = Math.round(rules.deadlineUrgency * 0.6);
    } else {
      scores.deadlineUrgency = 0; // too late, don't recommend
    }
  }

  // Prestation match: boost if opportunity prestations overlap with subscriber's specialties
  const subPrestations = subscriber.prestations ?? [];
  const oppPrestations = opportunity.prestations ?? [];
  if (subPrestations.length > 0) {
    let prestationHit: boolean;
    if (oppPrestations.length > 0) {
      // Use LLM-extracted prestations from opportunity (precise matching)
      const oppSet = new Set(oppPrestations.map((p) => p.toLowerCase()));
      prestationHit = subPrestations.some((p) => oppSet.has(p.toLowerCase()));
    } else {
      // Fallback: match against title for old opportunities without prestations
      prestationHit = subPrestations.some((p) =>
        titleLower.includes(p.toLowerCase())
      );
    }
    scores.prestationMatch = prestationHit ? rules.prestationMatch : 0;
  } else {
    // No prestations selected = all specialties, give full points
    scores.prestationMatch = rules.prestationMatch;
  }

  return scores;
}

export function computeTotalScore(breakdown: Record<string, number>): number {
  return Object.values(breakdown).reduce((sum, v) => sum + v, 0);
}
