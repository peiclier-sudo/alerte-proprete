import { SectorConfig } from "@/lib/types";

export const espacesVerts: SectorConfig = {
  // ─── Identity ───────────────────────────────────────────
  slug: "espaces-verts",
  name: "Espaces Verts & Paysage",
  shortName: "Espaces Verts",
  tagline: "espaces verts",
  emoji: "",

  // ─── Data Pipeline ──────────────────────────────────────
  cpvPrefixes: ["77310", "77311", "77312", "77313", "77314"],
  nafCodes: ["81.30Z"],
  keywordsInclude: [
    "espaces verts",
    "entretien paysager",
    "élagage",
    "tonte",
    "désherbage",
    "plantation",
    "arrosage",
    "aménagement paysager",
    "fauchage",
    "taille",
    "engazonnement",
    "fleurissement",
    "gestion différenciée",
  ],
  keywordsExclude: [
    "espaces verts intérieurs",
    "plantes d'intérieur",
    "décoration florale",
    "agriculture",
    "sylviculture",
    "exploitation forestière",
  ],
  typicalContractMonths: 48,
  typicalContractRange: { min: 40_000, max: 250_000 },

  // ─── LLM Prompts ───────────────────────────────────────
  qualificationPrompt: `Tu es un expert en marchés publics d'espaces verts et de paysage en France.
Ton rôle : analyser un avis de marché public et déterminer s'il concerne une PME paysagiste (NAF 81.30Z).

Critères de qualification :
- L'objet porte sur l'entretien d'espaces verts, le paysage, l'élagage, la tonte, le désherbage, la plantation, l'aménagement paysager
- Les codes CPV commencent par 773xx (services de plantation et d'entretien d'espaces verts)
- Le montant estimé est compatible avec une PME (< 1M€)
- Le marché n'est PAS de l'agriculture, de la sylviculture, ou de l'exploitation forestière

Points d'attention spécifiques :
- Loi Labbé / Zéro-phyto : détecter les clauses de gestion différenciée, interdiction des produits phytosanitaires
- Gestion différenciée : classer les espaces par niveau d'entretien (intensif, semi-intensif, extensif)
- Certifications : Qualipaysage, EVE (Espaces Végétaux Écologiques), label EcoJardin
- Saisonnalité : les marchés ont souvent des variations saisonnières (tonte mars-octobre, élagage novembre-mars)

Pour chaque AO, retourne un JSON :
{
  "qualified": true/false,
  "confidence": 0-100,
  "reason": "explication courte",
  "cpv_match": true/false,
  "estimated_amount": number|null,
  "contract_duration_months": number|null,
  "renewal_possible": true/false,
  "zero_phyto": true/false,
  "gestion_differenciee": true/false,
  "lots": [{ "number": 1, "description": "...", "relevant": true/false }]
}`,

  scoringRules: {
    geoMatch: 30,
    cpvMatch: 25,
    sizeMatch: 20,
    renewalBonus: 15,
    deadlineUrgency: 10,
  },

  certifications: [
    "Qualipaysage",
    "EVE (Espaces Végétaux Écologiques)",
    "EcoJardin",
    "ISO 14001",
    "Certiphyto",
  ],

  // ─── Landing Page ──────────────────────────────────────
  landing: {
    color: "#10B981",
    colorLight: "#ECFDF5",
    colorDark: "#064E3B",

    heroQuestion:
      "La mairie d'à côté vient d'attribuer un marché d'espaces verts. Vous ne l'avez jamais vu passer.",
    heroSubtitle:
      "Chaque semaine, des dizaines de marchés de tonte, élagage et aménagement sont publiés. MonMarché les détecte en temps réel, les score pour votre profil, et vous les livre chaque matin.",

    painPoints: [
      {
        before:
          "Vous l'apprenez par un confrère : « Tu as vu le marché de la mairie ? » Non. C'est trop tard.",
        after:
          "Alerte dès J+0, score de pertinence et deadline. Vous répondez en premier.",
      },
      {
        before:
          "40 pages de CCTP à lire pour découvrir les exigences zéro-phyto. Quand vous avez le temps ?",
        after:
          "Clauses Loi Labbé, gestion différenciée, certifications — détectées automatiquement.",
      },
      {
        before:
          "3 réponses ce mois : un marché trop gros, un trop loin, un pas dans votre spécialité.",
        after:
          "On filtre par taille, zone et spécialité. Chaque marché reçu est un marché jouable.",
      },
    ],

    steps: [
      {
        title: "Entrez votre SIRET",
        description:
          "On détecte votre zone d'intervention, vos certifications, et votre taille d'entreprise.",
      },
      {
        title: "On surveille pour vous",
        description:
          "Notre IA analyse les AO du BOAMP : entretien parcs, élagage, aménagement, fleurissement...",
      },
      {
        title: "Vous ouvrez votre email",
        description:
          "Chaque matin, vos marchés scorés de 0 à 100 avec les clauses clés identifiées.",
      },
    ],

    pricing: [
      {
        name: "Essentiel",
        price: 49,
        period: "mois",
        features: [
          "Marchés espaces verts qualifiés par IA",
          "Score de pertinence 0-100",
          "Montant estimé & durée du contrat",
          "Détection des clauses zéro-phyto",
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
          "Détection gestion différenciée & niveaux d'entretien",
          "Identification des critères de notation",
          "Rapport de préparation à la réponse",
          "Trame de mémoire technique personnalisée",
        ],
        cta: "Essayer 14 jours — gratuit, sans CB →",
        popular: true,
      },
    ],

    faq: [
      {
        question:
          "La loi zéro-phyto change les marchés d'espaces verts ?",
        answer:
          "Oui, depuis la loi Labbé (2017), les collectivités ne peuvent plus utiliser de produits phytosanitaires chimiques. Les CCTP intègrent désormais des clauses de gestion différenciée, de désherbage alternatif et de paillage. Notre IA détecte automatiquement ces clauses pour vous.",
      },
      {
        question:
          "Je fais surtout de l'élagage, pas de la tonte. C'est adapté ?",
        answer:
          "Oui. On filtre par type de prestation : élagage, tonte, plantation, fleurissement, aménagement. Vous pouvez configurer vos spécialités lors de l'inscription. Si un marché a un lot élagage dans un marché multi-lots, on vous le signale spécifiquement.",
      },
      {
        question:
          "49€/mois, c'est rentable pour un paysagiste ?",
        answer:
          "Un marché municipal d'entretien d'espaces verts = 40 000 à 250 000€ sur 3-4 ans. MonMarché coûte 588€/an. Il suffit d'un seul marché remporté grâce à une opportunité détectée pour rentabiliser des années d'abonnement.",
      },
      {
        question:
          "Qualipaysage est obligatoire pour répondre ?",
        answer:
          "Non, Qualipaysage n'est jamais obligatoire légalement. Mais beaucoup d'acheteurs le mentionnent comme critère d'appréciation dans le mémoire technique. Notre rapport de préparation identifie si la certification est mentionnée dans le RC et comment la valoriser dans votre réponse.",
      },
      {
        question: "Comment vous détectez les marchés de ma zone ?",
        answer:
          "Via votre SIRET, on connaît votre siège social. Vous définissez ensuite votre rayon d'intervention (30km, 50km, département, région). On score les marchés en fonction de la distance : un marché à 10km score plus haut qu'un marché à 80km.",
      },
    ],

    ctaFinal: {
      title:
        "Le prochain marché d'espaces verts de votre zone est peut-être publié aujourd'hui.",
      subtitle:
        "Entrez votre SIRET. Demain à 7h, vos marchés scorés dans votre boîte mail. Gratuit, sans engagement.",
      buttonText: "Recevoir mes marchés demain matin →",
    },

    socialProof: {
      stat: "280+",
      label: "marchés d'espaces verts analysés ce mois",
    },
  },

  // ─── SEO ────────────────────────────────────────────────
  seo: {
    title:
      "Veille marchés publics espaces verts & paysage | MonMarché",
    description:
      "Recevez chaque matin les appels d'offres espaces verts qualifiés par IA. Détection zéro-phyto, gestion différenciée, analyse DCE. Pour les PME paysagistes.",
    keywords: [
      "marchés publics espaces verts",
      "appels d'offres paysagiste",
      "veille marchés publics espaces verts",
      "marchés publics entretien parcs",
      "appels d'offres élagage collectivités",
    ],
  },

  // ─── Stripe ─────────────────────────────────────────────
  stripe: {
    essentialPriceId: "price_ev_essential_49",
    proPriceId: "price_ev_pro_99",
  },

  // ─── Email ──────────────────────────────────────────────
  email: {
    fromName: "MonMarché Espaces Verts",
    subjectTemplate:
      "{{count}} marchés espaces verts pour vous — {{date}}",
    digestIntro:
      "Voici les nouveaux marchés d'espaces verts qui correspondent à votre profil.",
  },
};
