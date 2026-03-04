// ─── Sector Config Types ──────────────────────────────────

export interface SectorConfig {
  // Identity
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  emoji: string;

  // Data Pipeline
  cpvPrefixes: string[];
  nafCodes: string[];
  keywordsInclude: string[];
  keywordsExclude: string[];
  typicalContractMonths: number;
  typicalContractRange: { min: number; max: number };

  // LLM
  qualificationPrompt: string;
  scoringRules: ScoringRules;
  certifications: string[];

  // Landing Page
  landing: LandingConfig;

  // SEO
  seo: SeoConfig;

  // Stripe
  stripe: StripeConfig;

  // Email
  email: EmailConfig;
}

export interface ScoringRules {
  geoMatch: number;
  cpvMatch: number;
  sizeMatch: number;
  renewalBonus: number;
  deadlineUrgency: number;
}

export interface LandingConfig {
  color: string;
  colorLight: string;
  colorDark: string;

  heroQuestion: string;
  heroSubtitle: string;

  painPoints: PainPoint[];
  steps: Step[];
  pricing: PricingTier[];
  faq: FaqItem[];

  ctaFinal: {
    title: string;
    subtitle: string;
    buttonText: string;
  };

  socialProof: {
    stat: string;
    label: string;
  };
}

export interface PainPoint {
  before: string;
  after: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string[];
}

export interface StripeConfig {
  essentialPriceId: string;
  proPriceId: string;
}

export interface EmailConfig {
  fromName: string;
  subjectTemplate: string;
  digestIntro: string;
}

// ─── Database Types (Supabase) ────────────────────────────

export interface Subscriber {
  id: string;
  email: string;
  siret: string;
  company_name: string;
  sector_slug: string;
  naf_code: string;
  plan: "essential" | "pro";
  geo_lat: number;
  geo_lng: number;
  geo_radius_km: number;
  department: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketOpportunity {
  id: string;
  boamp_id: string;
  sector_slug: string;
  title: string;
  buyer_name: string;
  buyer_department: string;
  cpv_codes: string[];
  estimated_amount: number | null;
  contract_duration_months: number | null;
  deadline: string;
  publication_date: string;
  source_url: string;
  renewal_possible: boolean;
  outgoing_holder: string | null;
  // LLM qualification
  qualified: boolean;
  confidence: number;
  qualification_reason: string;
  raw_llm_response: Record<string, unknown>;
  // Metadata
  created_at: string;
}

export interface DigestItem {
  id: string;
  subscriber_id: string;
  opportunity_id: string;
  score: number;
  score_breakdown: Record<string, number>;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
}

// ─── BOAMP API Types ──────────────────────────────────────

export interface BoampAnnouncement {
  id: string;
  objet: string;
  organisme: string;
  departement: string;
  date_publication: string;
  date_limite_reponse: string;
  cpv: string[];
  montant?: number;
  url: string;
  type_marche: string;
  nature: string;
  lots?: BoampLot[];
}

export interface BoampLot {
  numero: number;
  intitule: string;
  cpv?: string[];
  montant?: number;
}
