/**
 * The plain option data behind the intake form: nationalities, genders,
 * provinces and the practice-area -> sub-service map every dropdown is built
 * from. This is the single source of truth for services (`schema.ts` and
 * `constants.ts` both derive from it).
 *
 * It lives apart from `schema.ts` on purpose. `schema.ts` imports Zod and,
 * through `intake/validators`, libphonenumber-js. `constants.ts` needs only
 * these lists, but it is imported by `header.tsx` — which is in the root
 * layout — so routing the lists through `schema.ts` pulled the whole
 * validation stack into the first-load bundle of every page. Keeping the data
 * dependency-free keeps it out.
 *
 * Nothing in this file may import Zod or libphonenumber.
 */

/* ------------------------------------------------------------------ */
/* Step 1 — Nationality                                               */
/* ------------------------------------------------------------------ */
export const NATIONALITIES = [
  "pakistani-national",
  "overseas-pakistani",
  "foreign-national",
] as const;

/* ------------------------------------------------------------------ */
/* Step 2 — Personal & contact details                                */
/* ------------------------------------------------------------------ */
export const GENDERS = ["male", "female"] as const;

export const PROVINCES = [
  "punjab",
  "sindh",
  "kpk",
  "balochistan",
  "gilgit-baltistan",
  "azad-kashmir",
  "islamabad",
] as const;

/* ------------------------------------------------------------------ */
/* Step 3 — Service + dependent sub-service                           */
/* Single source of truth: constants.ts imports this same object to   */
/* build dropdown labels, so schema and UI can never drift apart.     */
/* ------------------------------------------------------------------ */
export const SERVICE_SUBSERVICE_MAP = {
  "public-institution-complaints": [
    "cda",
    "hec",
    "nadra",
    "pemra",
    "fbr",
    "secp",
    "pta",
    "ogra",
    "nepra",
    "pesco",
    "sbp",
    "ppra",
  ],
  "facilitation-center": [
    "secp-registration",
    "pfa-license",
    "ihra-license",
    "drap-licensing",
    "ntn-registration",
    "strn-registration",
    "tax-filing",
    "property-transfer",
    "agreement-drafting",
    "tv-channel-registration",
    "restaurant-license",
    "chamber-of-commerce-registration",
    "succession-certification",
    "family-registration-certificate",
    "child-registration-certificate",
    "ip-service",
  ],
  "overseas-pakistani": [
    "property-verification-due-diligence",
    "property-sale-purchase-transfer",
    "property-dispute-illegal-possession",
    "power-of-attorney",
    "overseas-family-law",
    "inheritance-succession-matters",
    "will-drafting",
    "civil-litigation-court-representation",
    "corporate-business-legal-services",
    "documentation-affidavits-notarial",
  ],
  "regulatory-government": [
    "hec-degree-attestation",
    "nadra-complaint-resolution",
    "cda-development-authority-issues",
    "fbr-tax-authority-complaints",
    "utility-authority",
    "excise-taxation-department",
    "public-authority-complaints-followups",
    "regulatory-delay-maladministration",
  ],
  "women-desk": [
    "harassment-cases",
    "khula-process",
    "divorce-proceedings",
    "child-custody-guardianship",
    "maintenance-financial-support",
    "domestic-violence-protection",
    "womens-family-law",
    "inheritance-succession-rights",
    "dower-haq-mehr-recovery",
  ],
  litigation: [
    "civil-litigation",
    "commercial-arbitration",
    "constitutional-petitions",
    "adr-mediation",
  ],
  "due-diligence": [
    "property-title-verification",
    "corporate-ma-due-diligence",
    "company-background-verification",
    "contract-compliance-review",
    "litigation-encumbrance-search",
  ],
  "ip-trademark": [
    "trademark",
    "copyright",
    "industrial-design",
    "patent-innovation",
    "brand-protection",
  ],
} as const satisfies Record<string, readonly string[]>;

export type ServiceKey = keyof typeof SERVICE_SUBSERVICE_MAP;

// Built as a proper non-empty tuple (not `string[]`) so z.enum infers the
// literal union of service keys instead of widening to `string`. This is
// what lets constants.ts type dropdown values safely.
export const SERVICES = Object.keys(
  SERVICE_SUBSERVICE_MAP
) as [ServiceKey, ...ServiceKey[]];
