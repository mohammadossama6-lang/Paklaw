import { z } from "zod";

import {
  addressSchema,
  dobSchema,
  emailSchema,
  fullNameSchema,
} from "@/lib/intake/validators";

export {
  NATIONALITIES,
  GENDERS,
  PROVINCES,
  SERVICE_SUBSERVICE_MAP,
  SERVICES,
} from "@/lib/service-data";
export type { ServiceKey } from "@/lib/service-data";

import {
  NATIONALITIES,
  GENDERS,
  SERVICES,
  SERVICE_SUBSERVICE_MAP,
  type ServiceKey,
} from "@/lib/service-data";

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
