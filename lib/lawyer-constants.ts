import { PRACTICE_AREAS } from "@/lib/lawyer-schema";
import { toOptions } from "@/lib/constants";

const PRACTICE_AREA_LABELS: Record<(typeof PRACTICE_AREAS)[number], string> = {
  "civil-litigation": "Civil Litigation",
  "criminal-law": "Criminal Law",
  "corporate-law": "Corporate & Business Law",
  "family-law": "Family Law",
  "property-law": "Property Law",
  "tax-law": "Tax Law",
  "constitutional-law": "Constitutional Law",
  "labor-law": "Labor & Employment Law",
  "intellectual-property": "Intellectual Property",
  "immigration-law": "Immigration Law",
};

export const PRACTICE_AREA_OPTIONS = toOptions(PRACTICE_AREAS, PRACTICE_AREA_LABELS);
