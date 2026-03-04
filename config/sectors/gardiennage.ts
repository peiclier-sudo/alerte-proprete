import { SectorConfig } from "@/lib/types";

export const gardiennage: SectorConfig = {
  // ─── Identity ───────────────────────────────────────────
  slug: "gardiennage",
  name: "Gardiennage & Sécurité",
  shortName: "Sécurité",
  tagline: "sécurité",
  emoji: "",

  // ─── Data Pipeline ──────────────────────────────────────
  cpvPrefixes: ["79710", "79711", "79713", "79714", "79715"],
  nafCodes: ["80.10Z"],
  keywordsInclude: [
    "gardiennage",
    "surveillance",
    "sécurité",
    "sûreté",
    "agent de sécurité",
    "vigile",
    "rondes",
    "contrôle d'accès",
    "sécurité incendie",
    "SSIAP",
    "télésurveillance",
    "intervention sur alarme",
    "filtrage",
  ],
  keywordsExclude: [
    "sécurité informatique",
    "cybersécurité",
    "sécurité routière",
    "sécurité alimentaire",
    "sécurité sociale",
    "équipements de sécurité",
    "EPI",
  ],
  typicalContractMonths: 36,
  typicalContractRange: { min: 80_000, max: 500_000 },

  // ─── LLM Prompts ───────────────────────────────────────
  qualificationPrompt: `Tu es un expert en marchés publics de gardiennage et sécurité privée en France.
Ton rôle : analyser un avis de marché public et déterminer s'il concerne une PME de sécurité (NAF 80.10Z).

Critères de qualification :
- L'objet porte sur le gardiennage, la surveillance, la sécurité humaine, le contrôle d'accès, la sécurité incendie (SSIAP)
- Les codes CPV commencent par 7971x (services de gardiennage et sécurité)
- Le montant estimé est compatible avec une PME (< 2M€)
- Le marché n'est PAS de la cybersécurité, sécurité routière, EPI, ou équipements de sécurité

Points d'attention CRITIQUES pour la sécurité privée :
- CNAPS : vérifier si l'autorisation CNAPS est mentionnée (obligatoire pour toute activité de sécurité privée)
- Reprise du personnel : détecter les clauses de transfert de personnel (article 7 CCN, anciennement annexe VII). C'est l'enjeu #1 pour les entreprises.
- Qualifications agents : SSIAP 1/2/3, CQP APS, TFP APS, carte professionnelle
- Calcul coût agent : horaires jour/nuit/weekend/férié, coefficient de charges
- Certifications : APSAD, CNPP, Qualisr, ISO 18788
- Planning : heures de vacation, poste fixe vs rondes, 24/7 vs heures ouvrées

Pour chaque AO, retourne un JSON :
{
  "qualified": true/false,
  "confidence": 0-100,
  "reason": "explication courte",
  "cpv_match": true/false,
  "estimated_amount": number|null,
  "contract_duration_months": number|null,
  "renewal_possible": true/false,
  "reprise_personnel": true/false,
  "cnaps_required": true/false,
  "ssiap_required": true/false,
  "night_shifts": true/false,
  "lots": [{ "number": 1, "description": "...", "relevant": true/false }]
}`,

  scoringRules: {
    geoMatch: 25,
    cpvMatch: 25,
    sizeMatch: 20,
    renewalBonus: 15,
    deadlineUrgency: 15,
  },

  certifications: [
    "CNAPS (obligatoire)",
    "APSAD",
    "CNPP",
    "Qualisr",
    "ISO 18788",
    "MASE",
  ],

  // ─── Landing Page ──────────────────────────────────────
  landing: {
    color: "#EA580C",
    colorLight: "#FFF7ED",
    colorDark: "#7C2D12",

    heroQuestion:
      "Combien de marchés de sécurité perdez-vous faute de veille ?",
    heroSubtitle:
      "Les marchés de gardiennage sont ultra-compétitifs : 10+ réponses par AO. MonMarché vous donne un avantage décisif : détection instantanée, analyse des clauses de reprise du personnel, et rapport de préparation aligné sur les critères de notation.",

    painPoints: [
      {
        before:
          "Vous découvrez un marché de gardiennage quand un concurrent vous en parle",
        after:
          "Alerte dès publication avec score de pertinence, montant estimé et deadline",
      },
      {
        before:
          "La clause de reprise du personnel est noyée dans 80 pages de DCE",
        after:
          "Détection automatique des clauses de transfert (art. 7 CCN), effectifs à reprendre, ancienneté",
      },
      {
        before:
          "Votre mémoire technique est générique, pas aligné sur les critères du RC",
        after:
          "Trame de mémoire technique personnalisée selon les critères de notation identifiés dans le RC",
      },
    ],

    steps: [
      {
        title: "Entrez votre SIRET",
        description:
          "On détecte votre zone, vos autorisations CNAPS, et vos spécialités (gardiennage, SSIAP, rondes...).",
      },
      {
        title: "On surveille pour vous",
        description:
          "Notre IA analyse chaque AO de sécurité : gardiennage, SSIAP, contrôle d'accès, télésurveillance.",
      },
      {
        title: "Vous ouvrez votre email",
        description:
          "Vos marchés scorés avec les clauses clés : reprise personnel, nuit/weekend, certifications requises.",
      },
    ],

    pricing: [
      {
        name: "Essentiel",
        price: 49,
        period: "mois",
        features: [
          "Marchés sécurité qualifiés par IA",
          "Score de pertinence 0-100",
          "Montant estimé & durée du contrat",
          "Détection clauses de reprise du personnel",
          "Identification jour/nuit/weekend/férié",
          "Alertes reconduction de marchés existants",
        ],
        cta: "Commencer — 49€/mois",
        popular: false,
      },
      {
        name: "Pro",
        price: 99,
        period: "mois",
        features: [
          "Tout le plan Essentiel, plus :",
          "Analyse automatique du DCE complet",
          "Détail des postes : effectifs, qualifications, horaires",
          "Identification des critères de notation du RC",
          "Rapport de préparation avec structure du mémoire technique",
          "Estimation du coût agent par poste (jour/nuit/WE)",
        ],
        cta: "Essai gratuit 14 jours",
        popular: true,
      },
    ],

    faq: [
      {
        question:
          "La reprise du personnel (article 7 CCN), comment ça marche ?",
        answer:
          "Quand un marché de gardiennage change de titulaire, le nouveau prestataire doit reprendre les agents en poste (ancienneté, salaire, qualification). Notre rapport identifie automatiquement ces clauses dans le CCAP/RC, et estime l'impact sur votre coût de revient.",
      },
      {
        question:
          "On est 10+ à répondre sur chaque marché. Comment MonMarché m'aide ?",
        answer:
          "L'avantage compétitif n'est pas de trouver le marché (tout le monde le trouve), c'est de mieux y répondre. Notre plan Pro analyse les critères de notation du RC et génère une trame de mémoire technique alignée sur ce que l'acheteur va noter. Vous ne répondez plus « à côté ».",
      },
      {
        question: "CNAPS, SSIAP, CQP APS... vous gérez tout ça ?",
        answer:
          "Oui. Notre IA détecte les exigences réglementaires de chaque AO : autorisation CNAPS, niveaux SSIAP requis (1, 2 ou 3), CQP/TFP APS, habilitations spécifiques. Si un marché exige du SSIAP 3 et que vous n'avez que du SSIAP 1, on vous le signale.",
      },
      {
        question:
          "Les gros groupes (Securitas, Fiducial) raflent tout. C'est pour les PME ?",
        answer:
          "Les grands groupes dominent les marchés nationaux. Mais les marchés locaux (mairies, hôpitaux, collectivités) sont accessibles aux PME, surtout quand l'allotissement est bien fait. MonMarché filtre les marchés à votre échelle et identifie les lots où les PME ont un avantage : réactivité, proximité, connaissance locale.",
      },
      {
        question:
          "Comment vous estimez le montant des marchés de sécurité ?",
        answer:
          "On croise le nombre de postes, les horaires (jour/nuit/24h), le coefficient de charges de la CCN sécurité, et les données DECP de marchés passés similaires. L'estimation vous permet de décider en 10 secondes si le marché est à votre taille.",
      },
    ],

    ctaFinal: {
      title:
        "Demain matin, les marchés de sécurité de votre zone dans votre boîte mail.",
      subtitle:
        "Entrez votre SIRET. Premier digest gratuit sous 24h.",
      buttonText: "Recevoir mon premier digest gratuit",
    },

    socialProof: {
      stat: "190+",
      label: "marchés de sécurité analysés ce mois",
    },
  },

  // ─── SEO ────────────────────────────────────────────────
  seo: {
    title:
      "Veille marchés publics gardiennage & sécurité | MonMarché",
    description:
      "Recevez chaque matin les appels d'offres de gardiennage qualifiés par IA. Détection reprise personnel, analyse CNAPS/SSIAP, critères de notation. Pour les PME de sécurité.",
    keywords: [
      "marchés publics gardiennage",
      "appels d'offres sécurité privée",
      "veille marchés publics sécurité",
      "marchés publics surveillance",
      "appels d'offres gardiennage collectivités",
    ],
  },

  // ─── Stripe ─────────────────────────────────────────────
  stripe: {
    essentialPriceId: "price_secu_essential_49",
    proPriceId: "price_secu_pro_99",
  },

  // ─── Email ──────────────────────────────────────────────
  email: {
    fromName: "MonMarché Sécurité",
    subjectTemplate:
      "{{count}} marchés de sécurité pour vous — {{date}}",
    digestIntro:
      "Voici les nouveaux marchés de gardiennage et sécurité qui correspondent à votre profil.",
  },
};
