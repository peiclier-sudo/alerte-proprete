-- Add prestations (service type specialties) to subscribers
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS prestations TEXT[] DEFAULT '{}';
