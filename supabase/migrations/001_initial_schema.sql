-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  MonMarché — Supabase Schema                                ║
-- ║  Multi-sector public procurement newsletter SaaS             ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- ─── Subscribers ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  siret TEXT NOT NULL,
  company_name TEXT NOT NULL,
  sector_slug TEXT NOT NULL,
  naf_code TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'essential' CHECK (plan IN ('essential', 'pro')),
  geo_lat DOUBLE PRECISION DEFAULT 0,
  geo_lng DOUBLE PRECISION DEFAULT 0,
  geo_radius_km INTEGER DEFAULT 50,
  department TEXT DEFAULT '',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (email, sector_slug, department)
);

-- Index for cron jobs (get active subscribers per sector)
CREATE INDEX idx_subscribers_active_sector ON subscribers (active, sector_slug);
CREATE INDEX idx_subscribers_stripe ON subscribers (stripe_subscription_id);

-- ─── Opportunities (qualified market announcements) ───────────

CREATE TABLE IF NOT EXISTS opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  boamp_id TEXT NOT NULL UNIQUE,
  sector_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  buyer_name TEXT DEFAULT '',
  buyer_department TEXT DEFAULT '',
  cpv_codes TEXT[] DEFAULT '{}',
  estimated_amount NUMERIC,
  contract_duration_months INTEGER,
  deadline TIMESTAMPTZ,
  publication_date TIMESTAMPTZ,
  source_url TEXT DEFAULT '',
  renewal_possible BOOLEAN DEFAULT false,
  outgoing_holder TEXT,
  -- LLM qualification
  qualified BOOLEAN DEFAULT false,
  confidence INTEGER DEFAULT 0,
  qualification_reason TEXT DEFAULT '',
  raw_llm_response JSONB DEFAULT '{}',
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for scoring cron (get today's qualified opps per sector)
CREATE INDEX idx_opportunities_qualified ON opportunities (qualified, sector_slug, publication_date DESC);
CREATE INDEX idx_opportunities_boamp ON opportunities (boamp_id);

-- ─── Digest Items (scored opportunities per subscriber) ───────

CREATE TABLE IF NOT EXISTS digest_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  score_breakdown JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for send cron (get unsent items)
CREATE INDEX idx_digest_unsent ON digest_items (sent_at) WHERE sent_at IS NULL;
CREATE INDEX idx_digest_subscriber ON digest_items (subscriber_id, created_at DESC);

-- ─── Waitlist (for sectors not yet available) ─────────────────

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  requested_sector TEXT NOT NULL,
  naf_code TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── RLS Policies ─────────────────────────────────────────────

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE digest_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Service role (used by API routes) gets full access
-- These policies allow the service_role key to perform all operations
CREATE POLICY "Service role full access on subscribers"
  ON subscribers FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on opportunities"
  ON opportunities FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on digest_items"
  ON digest_items FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on waitlist"
  ON waitlist FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ─── Updated_at trigger ───────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
