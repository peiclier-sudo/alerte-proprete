import { getSector } from "./sectors";
import { BoampAnnouncement, SectorConfig } from "./types";

// ─── Qualification Prompt ─────────────────────────────────

export function buildQualificationPrompt(
  sectorSlug: string,
  announcement: BoampAnnouncement
): string {
  const sector = getSector(sectorSlug);

  return `${sector.qualificationPrompt}

---

Voici l'avis de marché à analyser :

Objet : ${announcement.objet}
Organisme : ${announcement.organisme}
Département : ${announcement.departement}
Date de publication : ${announcement.date_publication}
Date limite de réponse : ${announcement.date_limite_reponse}
CPV : ${announcement.cpv.join(", ")}
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
  subscriber: { department: string; geo_radius_km: number },
  opportunity: {
    buyer_department: string;
    estimated_amount: number | null;
    deadline: string;
    renewal_possible: boolean;
    cpv_codes: string[];
  }
): Record<string, number> {
  const rules = sector.scoringRules;
  const scores: Record<string, number> = {};

  // Geo match
  const sameDept = subscriber.department === opportunity.buyer_department;
  scores.geoMatch = sameDept ? rules.geoMatch : Math.round(rules.geoMatch * 0.3);

  // CPV match
  const cpvMatch = opportunity.cpv_codes.some((cpv) =>
    sector.cpvPrefixes.some((prefix) => cpv.startsWith(prefix))
  );
  scores.cpvMatch = cpvMatch ? rules.cpvMatch : 0;

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
  const daysLeft = Math.ceil(
    (new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (daysLeft > 15) {
    scores.deadlineUrgency = rules.deadlineUrgency;
  } else if (daysLeft > 5) {
    scores.deadlineUrgency = Math.round(rules.deadlineUrgency * 0.6);
  } else {
    scores.deadlineUrgency = 0; // too late, don't recommend
  }

  return scores;
}

export function computeTotalScore(breakdown: Record<string, number>): number {
  return Object.values(breakdown).reduce((sum, v) => sum + v, 0);
}
