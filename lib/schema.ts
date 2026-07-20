import { z } from "zod";

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
} as const satisfies Record<string, readonly string[]>;

export type ServiceKey = keyof typeof SERVICE_SUBSERVICE_MAP;

// Built as a proper non-empty tuple (not `string[]`) so z.enum infers the
// literal union of service keys instead of widening to `string`. This is
// what lets constants.ts type dropdown values safely.
export const SERVICES = Object.keys(
  SERVICE_SUBSERVICE_MAP
) as [ServiceKey, ...ServiceKey[]];

/* ------------------------------------------------------------------ */
/* Main schema                                                        */
/* ------------------------------------------------------------------ */
export const leadSchema = z
  .object({
    // Step 1
    nationality: z.enum(NATIONALITIES, {
      error: "Please select your nationality.",
    }),

    // Step 2
    fullName: z.string().min(2, "Please enter your full name."),
    email: z.email("Please enter a valid email address."),
    phone: z
      .string()
      .min(7, "Please enter a valid phone number.")
      .max(20, "Please enter a valid phone number."),
    gender: z.enum(GENDERS, { error: "Please select your gender." }),
    dob: z.iso.date("Please enter a valid date of birth."),
    province: z.enum(PROVINCES, { error: "Please select your province." }),
    city: z.string().min(2, "Please enter your city."),
    address: z.string().min(5, "Please enter your address."),

    // Step 3 — subService's *valid values* depend on `service`, so it's
    // just a non-empty string here; the real check happens below in
    // superRefine, where both fields are available together.
    service: z.enum(SERVICES, { error: "Please select a service." }),
    subService: z.string().min(1, "Please select a sub-service."),

    // Step 4
    message: z.string().min(10, "Please tell us a bit more (10+ characters)."),
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
  });

export type LeadFormValues = z.infer<typeof leadSchema>;

/* ------------------------------------------------------------------ */
/* Which fields belong to each step — used for per-step validation.   */
/* The form now has 2 top-level steps: "Your details" (nationality +  */
/* personal + location) and "Service" (service + subService + message */
/* + consent).                                                        */
/* ------------------------------------------------------------------ */
export const STEP_FIELDS: readonly (keyof LeadFormValues)[][] = [
  ["nationality", "fullName", "email", "phone", "gender", "dob", "province", "city", "address"],
  ["service", "subService", "message", "consent"],
];

/* ------------------------------------------------------------------ */
/* The "Your details" step is split into three animated sub-steps     */
/* (nationality, then personal, then location) so it doesn't feel     */
/* like one long wall of fields.                                      */
/* ------------------------------------------------------------------ */
export const DETAILS_SUB_STEP_FIELDS: readonly (keyof LeadFormValues)[][] = [
  ["nationality"],
  ["fullName", "email", "phone", "gender", "dob"],
  ["province", "city", "address"],
];