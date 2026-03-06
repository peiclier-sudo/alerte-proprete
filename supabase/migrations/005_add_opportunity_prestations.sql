-- Add prestations column to opportunities table
-- Stores the service types detected by LLM during qualification
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS prestations TEXT[] DEFAULT '{}';
