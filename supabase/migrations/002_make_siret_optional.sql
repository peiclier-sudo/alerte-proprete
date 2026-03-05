-- Make SIRET-related columns optional since signup now only requires
-- email + sector + department

ALTER TABLE subscribers ALTER COLUMN siret SET DEFAULT '';
ALTER TABLE subscribers ALTER COLUMN siret DROP NOT NULL;

ALTER TABLE subscribers ALTER COLUMN company_name SET DEFAULT '';
ALTER TABLE subscribers ALTER COLUMN company_name DROP NOT NULL;

ALTER TABLE subscribers ALTER COLUMN naf_code SET DEFAULT '';
ALTER TABLE subscribers ALTER COLUMN naf_code DROP NOT NULL;
