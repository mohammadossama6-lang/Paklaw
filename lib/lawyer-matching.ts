import { prisma } from "@/lib/prisma";
import type { ServiceKey } from "@/lib/schema";
import type { PRACTICE_AREAS } from "@/lib/lawyer-schema";
import type { LawyerApplication } from "@/lib/generated/prisma/client";

type PracticeArea = (typeof PRACTICE_AREAS)[number];

// Client-facing service categories don't share a vocabulary with lawyer
// practice areas, so each client service maps to the practice area(s) whose
// lawyers are actually equipped to handle it.
const SERVICE_TO_PRACTICE_AREAS: Record<ServiceKey, PracticeArea[]> = {
  "public-institution-complaints": ["constitutional-law", "civil-litigation"],
  "facilitation-center": [
    "corporate-law",
    "tax-law",
    "property-law",
    "intellectual-property",
    "family-law",
  ],
  "overseas-pakistani": ["property-law", "family-law", "civil-litigation", "corporate-law"],
  "regulatory-government": ["constitutional-law", "tax-law"],
  "women-desk": ["family-law"],
  litigation: ["civil-litigation", "corporate-law", "constitutional-law"],
};

/**
 * Finds the best-matching registered lawyer for a client lead: same
 * province is required, a practice area overlapping the client's requested
 * service is required, and an exact city match (when available) is
 * preferred over other candidates in the same province.
 */
export async function findMatchingLawyer(params: {
  service: ServiceKey;
  province: string;
  city: string;
}): Promise<LawyerApplication | null> {
  const practiceAreas = SERVICE_TO_PRACTICE_AREAS[params.service];

  const candidates = await prisma.lawyerApplication.findMany({
    where: {
      province: params.province,
      practiceAreas: { hasSome: practiceAreas },
    },
    orderBy: { createdAt: "desc" },
  });

  if (candidates.length === 0) return null;

  const normalizedCity = params.city.trim().toLowerCase();
  const cityMatch = candidates.find(
    (lawyer) => lawyer.city.trim().toLowerCase() === normalizedCity
  );

  return cityMatch ?? candidates[0];
}
