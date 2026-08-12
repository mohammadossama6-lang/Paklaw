import { z } from "zod";

import {
  addressSchema,
  dobSchema,
  emailSchema,
  fullNameSchema,
} from "@/lib/intake/validators";

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
    "patent",
    "innovation",
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

/* ------------------------------------------------------------------ */
/* Persisted lead schema — the normalized shape stored in the database */
/* and validated by the API. The client form (see                     */
/* lib/intake/form-schema.ts) collapses its three per-nationality      */
/* variants into this shape before submitting: a single `phone`, and   */
/* either `province` (Pakistani citizens) or `country` + `state`       */
/* (overseas / foreign), never both.                                   */
/* ------------------------------------------------------------------ */
export const leadSchema = z
  .object({
    nationality: z.enum(NATIONALITIES, { error: "Please select your nationality." }),

    fullName: fullNameSchema,
    email: emailSchema,
    phone: z
      .string()
      .min(5, "Please enter a valid phone number.")
      .max(24, "Please enter a valid phone number."),
    gender: z.enum(GENDERS, { error: "Please select your gender." }),
    dob: dobSchema,
    address: addressSchema,
    city: z.string().trim().min(2, "Please enter your city.").max(80),

    // Pakistani citizens supply a province; overseas / foreign supply a
    // country (+ state). All are nullable so a lead only carries the ones
    // relevant to its nationality.
    province: z.string().max(60).optional().nullable(),
    country: z.string().max(80).optional().nullable(),
    state: z.string().max(80).optional().nullable(),

    // subService's valid values depend on `service`; the real check happens
    // in superRefine below where both fields are available together.
    service: z.enum(SERVICES, { error: "Please select a service." }),
    subService: z.string().min(1, "Please select a sub-service."),

    message: z.string().trim().min(10, "Please tell us a bit more (10+ characters)."),
    consent: z
      .boolean()
      .refine((val) => val === true, "You must agree to be contacted to submit."),
  })
  .superRefine((data, ctx) => {
    const validSubServices: readonly string[] | undefined =
      SERVICE_SUBSERVICE_MAP[data.service as ServiceKey];
    if (!validSubServices?.includes(data.subService)) {
      ctx.addIssue({
        code: "custom",
        path: ["subService"],
        message: "Please select a valid sub-service for the chosen service.",
      });
    }

    if (data.nationality === "pakistani-national") {
      if (!data.province) {
        ctx.addIssue({ code: "custom", path: ["province"], message: "Province is required." });
      }
    } else if (!data.country) {
      ctx.addIssue({ code: "custom", path: ["country"], message: "Country is required." });
    }
  });

export type LeadFormValues = z.infer<typeof leadSchema>;
export type LeadInput = z.input<typeof leadSchema>;