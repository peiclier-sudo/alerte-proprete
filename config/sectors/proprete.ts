import { SectorConfig } from "@/lib/types";

export const proprete: SectorConfig = {
  // ─── Identity ───────────────────────────────────────────
  slug: "proprete",
  name: "Propreté & Nettoyage",
  shortName: "Propreté",
  tagline: "nettoyage",
  emoji: "✨",

  // ─── Data Pipeline ──────────────────────────────────────
  cpvPrefixes: ["90910", "90911", "90914", "90919"],
  nafCodes: ["81.21Z", "81.22Z", "81.29A", "81.29B"],
  keywordsInclude: [
    "nettoyage",
    "propreté",
    "entretien locaux",
    "entretien ménager",
    "vitrerie",
    "remise en état",
    "décapage",
    "lustrage",
    "désinfection",
    "hygiène des locaux",
  ],
  keywordsExclude: [
    "nettoyage urbain",
    "voirie",
    "assainissement",
    "déneigement",
    "curage",
  ],
  typicalContractMonths: 36,
  typicalContractRange: { min: 40_000, max: 400_000 },

  // ─── LLM Prompts ───────────────────────────────────────
  qualificationPrompt: `Tu es un expert en marchés publics de propreté et nettoyage en France.
Ton rôle : analyser un avis de marché public et déterminer s'il concerne une PME de nettoyage (NAF 81.21Z, 81.22Z, 81.29A, 81.29B).

Critères de qualification :
- L'objet porte sur le nettoyage, la propreté, l'entretien de locaux, la vitrerie, la remise en état
- Les codes CPV commencent par 909xx (services de nettoyage)
- Le montant estimé est compatible avec une PME (< 2M€)
- Le marché n'est PAS du nettoyage urbain, voirie, assainissement, curage

Pour chaque AO, retourne un JSON :
{
  "qualified": true/false,
  "confidence": 0-100,
  "reason": "explication courte",
  "cpv_match": true/false,
  "estimated_amount": number|null,
  "contract_duration_months": number|null,
  "renewal_possible": true/false,
  "lots": [{ "number": 1, "description": "...", "relevant": true/false }]
}`,

  scoringRules: {
    geoMatch: 30,
    cpvMatch: 25,
    sizeMatch: 20,
    renewalBonus: 15,
    deadlineUrgency: 10,
  },

  certifications: ["Qualipropre", "MASE", "ISO 14001", "Ecolabel Européen"],

  // ─── Landing Page ──────────────────────────────────────
  landing: {
    color: "#059669",
    colorLight: "#ecfdf5",
    colorDark: "#064e3b",

    heroQuestion:
      "Combien de marchés de nettoyage avez-vous raté ce mois-ci ?",
    heroSubtitle:
      "Chaque semaine, des centaines d'appels d'offres en propreté sont publiés. Vous en voyez combien ? MonMarché les détecte, les qualifie par IA, et vous envoie uniquement ceux qui matchent votre entreprise.",

    painPoints: [
      {
        before: "Vous passez 2h par jour sur BOAMP, PLACE, marches-publics.gouv",
        after:
          "Un email chaque matin avec vos marchés qualifiés, scorés, prêts à analyser",
      },
      {
        before:
          "Vous découvrez un marché intéressant... 3 jours avant la date limite",
        after:
          "Alerte dès la publication, avec le temps restant et le score d'urgence",
      },
      {
        before:
          "Impossible de savoir si un marché est à votre taille sans lire tout le DCE",
        after:
          "Montant estimé, durée, possibilité de reconduction — visible en 10 secondes",
      },
    ],

    steps: [
      {
        title: "Entrez votre SIRET",
        description:
          "On détecte automatiquement votre secteur, votre zone géographique et votre taille.",
      },
      {
        title: "On surveille pour vous",
        description:
          "Notre IA analyse chaque nouvel AO du BOAMP et le qualifie selon votre profil.",
      },
      {
        title: "Vous ouvrez votre email",
        description:
          "Chaque matin, un digest avec vos marchés scorés de 0 à 100. Vous décidez en 2 minutes.",
      },
    ],

    pricing: [
      {
        name: "Essentiel",
        price: 49,
        period: "mois",
        features: [
          "Marchés qualifiés par IA chaque matin",
          "Score de pertinence 0-100",
          "Montant estimé & durée du contrat",
          "Titulaire sortant identifié (si disponible)",
          "Filtrage géographique intelligent",
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
          "Analyse automatique du DCE (RC, CCTP, CCAP)",
          "Rapport de préparation à la réponse",
          "Identification des critères de notation",
          "Détection des clauses clés (pénalités, reconduction)",
          "Trame de mémoire technique personnalisée",
        ],
        cta: "Essai gratuit 14 jours",
        popular: true,
      },
    ],

    faq: [
      {
        question:
          "49€/mois pour une petite boîte de nettoyage, ça vaut le coup ?",
        answer:
          "Un seul marché public remporté = 50 000 à 400 000€ de chiffre d'affaires sur 3 ans. MonMarché coûte 588€/an. Le ROI est atteint dès le premier marché gagné grâce à une opportunité que vous auriez ratée autrement.",
      },
      {
        question: "C'est quoi la différence avec BOAMP ou PLACE ?",
        answer:
          "BOAMP et PLACE publient TOUS les marchés publics de France. Vous devez chercher, filtrer, lire. MonMarché fait l'inverse : on filtre par IA selon votre profil, on qualifie, on score, et on vous envoie uniquement ce qui vous concerne. Vous passez de 2h de veille à 2 minutes de lecture.",
      },
      {
        question: "Comment vous estimez le montant des marchés ?",
        answer:
          "On croise les données BOAMP (quand le montant est publié), les données DECP (marchés passés similaires), et l'analyse IA du CCTP (surface, fréquence, nombre de sites). L'estimation n'est pas contractuelle mais vous donne un ordre de grandeur fiable pour décider si ça vaut le coup de répondre.",
      },
      {
        question: "Je suis une TPE (2-3 salariés), c'est adapté pour moi ?",
        answer:
          "Oui. On filtre par taille de marché. Si un AO concerne le nettoyage de 50 sites en France, on ne vous l'envoie pas. On vous envoie les marchés locaux, à votre échelle, auxquels vous avez réellement une chance de répondre.",
      },
      {
        question: "Je peux essayer avant de payer ?",
        answer:
          "Le plan Pro inclut 14 jours d'essai gratuit. Pour le plan Essentiel, on vous envoie un exemple de digest gratuit basé sur votre SIRET pour que vous voyiez la qualité avant de vous engager.",
      },
    ],

    ctaFinal: {
      title: "Demain matin, vos marchés dans votre boîte mail.",
      subtitle:
        "Entrez votre SIRET maintenant. Premier digest gratuit sous 24h.",
      buttonText: "Recevoir mon premier digest gratuit",
    },

    socialProof: {
      stat: "430+",
      label: "marchés de nettoyage analysés ce mois",
    },
  },

  // ─── SEO ────────────────────────────────────────────────
  seo: {
    title: "Veille marchés publics nettoyage & propreté | MonMarché",
    description:
      "Recevez chaque matin les appels d'offres de nettoyage qualifiés par IA. Score de pertinence, montant estimé, analyse du DCE. Pour les PME de propreté.",
    keywords: [
      "marchés publics nettoyage",
      "appels d'offres propreté",
      "veille marchés publics nettoyage",
      "appels d'offres nettoyage locaux",
      "marchés publics propreté PME",
    ],
  },

  // ─── Stripe ─────────────────────────────────────────────
  stripe: {
    essentialPriceId: "price_proprete_essential_49",
    proPriceId: "price_proprete_pro_99",
  },

  // ─── Email ──────────────────────────────────────────────
  email: {
    fromName: "MonMarché Propreté",
    subjectTemplate: "🧹 {{count}} marchés de nettoyage pour vous — {{date}}",
    digestIntro:
      "Voici les nouveaux marchés de nettoyage qui correspondent à votre profil.",
  },
};
