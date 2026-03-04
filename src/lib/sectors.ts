import { SectorConfig } from "./types";
import { proprete } from "@/config/sectors/proprete";
import { espacesVerts } from "@/config/sectors/espaces-verts";
import { gardiennage } from "@/config/sectors/gardiennage";

// ─── Registry ─────────────────────────────────────────────
// To add a new sector: create config file + add it here. That's it.

const SECTORS: Record<string, SectorConfig> = {
  proprete: proprete,
  "espaces-verts": espacesVerts,
  gardiennage: gardiennage,
};

// ─── Public API ───────────────────────────────────────────

export function getSector(slug: string): SectorConfig {
  const sector = SECTORS[slug];
  if (!sector) {
    throw new Error(`Unknown sector: ${slug}. Available: ${Object.keys(SECTORS).join(", ")}`);
  }
  return sector;
}

export function getAllSectors(): SectorConfig[] {
  return Object.values(SECTORS);
}

export function getAllSectorSlugs(): string[] {
  return Object.keys(SECTORS);
}

export function getSectorByNaf(nafCode: string): SectorConfig | null {
  return (
    Object.values(SECTORS).find((s) =>
      s.nafCodes.some((naf) => nafCode.startsWith(naf.replace(".", "")))
    ) ?? null
  );
}

export function getSectorByCpv(cpvCode: string): SectorConfig | null {
  return (
    Object.values(SECTORS).find((s) =>
      s.cpvPrefixes.some((prefix) => cpvCode.startsWith(prefix))
    ) ?? null
  );
}

export function isSectorSlug(slug: string): slug is string {
  return slug in SECTORS;
}
