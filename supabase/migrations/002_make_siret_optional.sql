-- Ensure subscribers table has all expected columns.
-- The live table may have been created manually without some columns
-- from the original migration. This adds any missing columns safely.

-- Columns that may be missing (originally NOT NULL but no longer required):
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS siret TEXT DEFAULT '';
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS company_name TEXT DEFAULT '';
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS naf_code TEXT DEFAULT '';

-- Columns needed for department-based signup:
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS department TEXT DEFAULT '';
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'essential';
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS geo_radius_km INTEGER DEFAULT 50;
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
