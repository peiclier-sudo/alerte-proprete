-- Fix unique constraint to allow one row per (email, sector, department)
-- instead of one row per (email, sector), which blocked multi-department signups.

ALTER TABLE subscribers DROP CONSTRAINT IF EXISTS subscribers_email_sector_slug_key;
ALTER TABLE subscribers ADD CONSTRAINT subscribers_email_sector_dept_key UNIQUE (email, sector_slug, department);
