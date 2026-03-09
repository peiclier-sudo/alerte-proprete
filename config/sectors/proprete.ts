import { SectorConfig } from "@/lib/types";

export const proprete: SectorConfig = {
  // ─── Identity ───────────────────────────────────────────
  slug: "proprete",
  name: "Propreté & Nettoyage",
  shortName: "Propreté",
  tagline: "nettoyage",
  emoji: "",

  // ─── Data Pipeline ──────────────────────────────────────
  cpvPrefixes: ["90910", "90911", "90914", "90919"],
  nafCodes: ["81.21Z", "81.22Z", "81.29A", "81.29B"],
  keywordsInclude: [
    // BOAMP exact descriptor labels (highest priority - used in search)
    "nettoyage de locaux",
    "nettoyage",
    "propreté",
    // Broader matching terms
    "entretien locaux",
    "entretien ménager",
    "vitrerie",
    "remise en état",
    "décapage",
    "lustrage",
    "désinfection",
    "hygiène locaux",
    "produits entretien",
  ],
  keywordsExclude: [
    "nettoyage urbain",
    "voirie",
    "assainissement",
    "déneigement",
    "curage",
    "travaux neufs",
    "construction",
  ],
  typicalContractMonths: 36,
  typicalContractRange: { min: 40_000, max: 400_000 },

  // ─── Prestations (user-facing specialties) ────────────
  prestations: [
    "Nettoyage de locaux",
    "Vitrerie",
    "Remise en état",
    "Désinfection",
    "Entretien ménager",
    "Décapage & lustrage",
  ],

  // ─── LLM Prompts ───────────────────────────────────────
  qualificationPrompt: `Tu es un expert en marchés publics de propreté et nettoyage en France.
Ton rôle : analyser un avis de marché public et déterminer s'il concerne une PME de nettoyage (NAF 81.21Z, 81.22Z, 81.29A, 81.29B).

IMPORTANT : Le BOAMP utilise ses propres codes descripteurs (pas les codes CPV standard). Analyse principalement le champ "Objet" et les "Descripteurs BOAMP" pour qualifier le marché.

Critères de qualification (qualifier = true si AU MOINS UN critère est rempli) :
- L'objet mentionne : nettoyage, propreté, entretien de locaux, entretien ménager, vitrerie, remise en état, décapage, lustrage, désinfection, hygiène
- Les descripteurs BOAMP mentionnent des termes liés au nettoyage ou à l'entretien de bâtiments
- Le marché concerne clairement des prestations de nettoyage même si le titre est générique (ex: "entretien des bâtiments communaux")

Critères d'EXCLUSION (qualifier = false) :
- Nettoyage urbain, voirie, assainissement, curage, déneigement
- Travaux de construction ou rénovation (pas de l'entretien/nettoyage)
- Montant > 2M€ (hors portée PME)

En cas de doute sur un marché qui POURRAIT être du nettoyage, qualifie-le avec une confidence plus basse (40-60) plutôt que de le rejeter.

Retourne un JSON :
{
  "qualified": true/false,
  "confidence": 0-100,
  "reason": "explication courte",
  "cpv_match": true/false,
  "estimated_amount": number|null,
  "contract_duration_months": number|null,
  "renewal_possible": true/false,
  "prestations": ["Nettoyage de locaux", "Vitrerie"],
  "lots": [{ "number": 1, "description": "...", "relevant": true/false }]
}`,

  scoringRules: {
    geoMatch: 25,
    cpvMatch: 20,
    sizeMatch: 15,
    renewalBonus: 15,
    deadlineUrgency: 10,
    prestationMatch: 15,
  },

  certifications: ["Qualipropre", "MASE", "ISO 14001", "Ecolabel Européen"],

  // ─── Landing Page ──────────────────────────────────────
  landing: {
    color: "#0EA5E9",
    colorLight: "#F0F9FF",
    colorDark: "#0C4A6E",

    heroQuestion:
      "Ce matin, 12 marchés de nettoyage ont été publiés. Vous en avez vu combien ?",
    heroSubtitle:
      "Vos concurrents répondent pendant que vous cherchez. MonMarché scanne chaque AO en propreté, le score de 0 à 100 pour votre profil, et vous l'envoie avant le café.",

    painPoints: [
      {
        before: "2h par jour à fouiller BOAMP, PLACE, marches-publics.gouv — pour 3 résultats utiles",
        after:
          "Un email, 2 minutes de lecture. Vos marchés sont scorés, triés, prêts.",
      },
      {
        before:
          "Vous trouvez le marché parfait... 72h avant la deadline. Trop tard pour bien répondre.",
        after:
          "Alerte dès J+0 de publication. Vous avez le temps de préparer une vraie réponse.",
      },
      {
        before:
          "Lire 40 pages de DCE pour découvrir que le marché fait 2M€. Hors de votre portée.",
        after:
          "Montant estimé, durée, taille du lot — visible en 10 secondes. Vous ne perdez plus de temps.",
      },
    ],

    steps: [
      {
        title: "Choisissez votre zone",
        description:
          "Département, spécialités, taille de marchés — on filtre pour vous.",
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
        cta: "Démarrer à 49€/mois →",
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
        cta: "Essayer 14 jours — gratuit, sans CB →",
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
          "Le plan Pro inclut 14 jours d'essai gratuit. Pour le plan Essentiel, on vous envoie un exemple de digest gratuit basé sur votre profil pour que vous voyiez la qualité avant de vous engager.",
      },
      {
        question: "Et si je ne reçois aucun marché pertinent ?",
        answer:
          "C'est le risque zéro : l'essai est gratuit pendant 14 jours. Si aucun marché ne vous correspond, vous ne payez rien. En moyenne, nos utilisateurs reçoivent 3 à 5 marchés pertinents par semaine.",
      },
    ],

    ctaFinal: {
      title: "Pendant que vous lisez ceci, des marchés sont publiés.",
      subtitle:
        "2 minutes d'inscription. Demain à 7h, vos premiers marchés scorés dans votre boîte mail. Gratuit, sans engagement.",
      buttonText: "Recevoir mes marchés demain matin →",
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
    subjectTemplate: "{{count}} marchés de nettoyage pour vous — {{date}}",
    digestIntro:
      "Voici les nouveaux marchés de nettoyage qui correspondent à votre profil.",
  },
};
