// ─── eForms Parser ──────────────────────────────────────
// Extracts structured data from the BOAMP `donnees` field,
// which contains eForms XML-as-JSON (UBL 2.3 / eForms SDK 1.x)

export interface EformsData {
  noticeType: "contract" | "award" | "prior-info" | "unknown";
  description: string;
  cpvCodes: string[];
  estimatedAmount: number | null;
  currency: string;
  contractDurationMonths: number | null;
  lots: EformsLot[];
  nutsCode: string;
  buyerCity: string;
  buyerPostalZone: string;
  procurementTypeCode: string; // "works" | "services" | "supplies"
}

export interface EformsLot {
  id: string;
  title: string;
  description: string;
  cpvCodes: string[];
  estimatedAmount: number | null;
  durationMonths: number | null;
}

/**
 * Parse the raw `donnees` field from BOAMP API into structured eForms data.
 * The field is either a JSON string or already-parsed object containing
 * { EFORMS: { ContractNotice | ContractAwardNotice | PriorInformationNotice: {...} } }
 */
export function parseEforms(raw: unknown): EformsData | null {
  if (!raw) return null;

  let donnees: any;
  if (typeof raw === "string") {
    try {
      donnees = JSON.parse(raw);
    } catch {
      return null;
    }
  } else {
    donnees = raw;
  }

  const eforms = donnees?.EFORMS;
  if (!eforms) return null;

  // Determine notice type from root key
  const noticeType = getNoticeType(eforms);
  const root = eforms.ContractNotice
    ?? eforms.ContractAwardNotice
    ?? eforms.PriorInformationNotice
    ?? {};

  // Extract main procurement project
  const project = root["cac:ProcurementProject"] ?? {};

  // Description
  const description = extractText(project["cbc:Description"]) || "";

  // CPV codes from main + additional classifications
  const cpvCodes = extractCpvCodes(project);

  // Estimated amount
  const { amount: estimatedAmount, currency } = extractAmount(project, root);

  // Contract duration
  const contractDurationMonths = extractDuration(project);

  // Location
  const location = project["cac:RealizedLocation"] ?? {};
  const address = location["cac:Address"] ?? {};
  const nutsCode = extractText(address["cbc:CountrySubentityCode"]) || "";
  const buyerCity = address["cbc:CityName"] || "";
  const buyerPostalZone = address["cbc:PostalZone"] || "";

  // Procurement type
  const procurementTypeCode = extractText(project["cbc:ProcurementTypeCode"]) || "";

  // Lots
  const lots = extractLots(root);

  // If no CPV at main level, collect from lots
  if (cpvCodes.length === 0) {
    for (const lot of lots) {
      cpvCodes.push(...lot.cpvCodes);
    }
  }

  // If no amount at main level, sum from lots
  let finalAmount = estimatedAmount;
  if (finalAmount === null && lots.length > 0) {
    const lotAmounts = lots.map((l) => l.estimatedAmount).filter((a): a is number => a !== null);
    if (lotAmounts.length > 0) {
      finalAmount = lotAmounts.reduce((sum, a) => sum + a, 0);
    }
  }

  // Also try to get total from NoticeResult (award notices)
  if (finalAmount === null) {
    finalAmount = extractAwardTotal(root);
  }

  return {
    noticeType,
    description,
    cpvCodes: [...new Set(cpvCodes)], // deduplicate
    estimatedAmount: finalAmount,
    currency,
    contractDurationMonths,
    lots,
    nutsCode,
    buyerCity,
    buyerPostalZone,
    procurementTypeCode,
  };
}

// ─── Internal Helpers ─────────────────────────────────────

function getNoticeType(eforms: any): EformsData["noticeType"] {
  if (eforms.ContractNotice) return "contract";
  if (eforms.ContractAwardNotice) return "award";
  if (eforms.PriorInformationNotice) return "prior-info";
  return "unknown";
}

/** Extract text from eForms value (can be string or { @languageID, #text }) */
function extractText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "#text" in value) {
    return (value as any)["#text"] ?? "";
  }
  return "";
}

/** Extract CPV codes from a ProcurementProject node */
function extractCpvCodes(project: any): string[] {
  const codes: string[] = [];

  // Main classification
  const main = project["cac:MainCommodityClassification"];
  if (main) {
    const code = extractText(main["cbc:ItemClassificationCode"]);
    if (code) codes.push(code);
  }

  // Additional classifications (can be array or single)
  const additional = project["cac:AdditionalCommodityClassification"];
  if (additional) {
    const items = Array.isArray(additional) ? additional : [additional];
    for (const item of items) {
      const code = extractText(item["cbc:ItemClassificationCode"]);
      if (code) codes.push(code);
    }
  }

  return codes;
}

/** Extract estimated amount from project or lot */
function extractAmount(project: any, root: any): { amount: number | null; currency: string } {
  // Try RequestedTenderTotal first
  const tenderTotal = project["cac:RequestedTenderTotal"];
  if (tenderTotal) {
    const estimated = tenderTotal["cbc:EstimatedOverallContractAmount"];
    if (estimated) {
      return {
        amount: parseFloat(extractText(estimated)) || null,
        currency: estimated["@currencyID"] ?? "EUR",
      };
    }
    // Framework max amount
    const ext = tenderTotal["ext:UBLExtensions"]?.["ext:UBLExtension"]
      ?.["ext:ExtensionContent"]?.["efext:EformsExtension"];
    if (ext?.["efbc:FrameworkMaximumAmount"]) {
      const fw = ext["efbc:FrameworkMaximumAmount"];
      return {
        amount: parseFloat(extractText(fw)) || null,
        currency: fw["@currencyID"] ?? "EUR",
      };
    }
  }

  return { amount: null, currency: "EUR" };
}

/** Extract total from NoticeResult (award notices) */
function extractAwardTotal(root: any): number | null {
  const ext = root["ext:UBLExtensions"]?.["ext:UBLExtension"]
    ?.["ext:ExtensionContent"]?.["efext:EformsExtension"];
  if (!ext) return null;

  const result = ext["efac:NoticeResult"];
  if (!result) return null;

  // Overall framework max
  const fwMax = result["efbc:OverallMaximumFrameworkContractsAmount"];
  if (fwMax) {
    return parseFloat(extractText(fwMax)) || null;
  }

  // Total amount
  const total = result["cbc:TotalAmount"];
  if (total) {
    return parseFloat(extractText(total)) || null;
  }

  return null;
}

/** Extract contract duration in months */
function extractDuration(project: any): number | null {
  const period = project["cac:PlannedPeriod"];
  if (!period) return null;

  const duration = period["cbc:DurationMeasure"];
  if (!duration) return null;

  const value = parseFloat(extractText(duration));
  if (isNaN(value)) return null;

  const unit = duration["@unitCode"] ?? "";
  switch (unit.toUpperCase()) {
    case "YEAR":
      return Math.round(value * 12);
    case "MONTH":
      return Math.round(value);
    case "DAY":
      return Math.round(value / 30);
    default:
      return Math.round(value); // assume months
  }
}

/** Extract lots from ProcurementProjectLot array */
function extractLots(root: any): EformsLot[] {
  const rawLots = root["cac:ProcurementProjectLot"];
  if (!rawLots) return [];

  const items = Array.isArray(rawLots) ? rawLots : [rawLots];
  return items.map((lot) => {
    const lotId = extractText(lot["cbc:ID"]) || "";
    const lotProject = lot["cac:ProcurementProject"] ?? lot["cac:TenderingTerms"]?.["cac:ProcurementProject"] ?? {};

    // Some lots have ProcurementProject nested under TenderingTerms
    const proj = lotProject["cbc:Name"] ? lotProject : (lot["cac:ProcurementProject"] ?? {});

    const title = extractText(proj["cbc:Name"]) || "";
    const description = extractText(proj["cbc:Description"]) || "";
    const cpvCodes = extractCpvCodes(proj);

    // Amount
    const { amount } = extractAmount(proj, {});

    // Duration
    const durationMonths = extractDuration(proj);

    return { id: lotId, title, description, cpvCodes, estimatedAmount: amount, durationMonths };
  });
}
