import { z } from "zod";

import {
  GENDERS,
  NATIONALITIES,
  PROVINCES,
  SERVICES,
  SERVICE_SUBSERVICE_MAP,
  type LeadInput,
  type ServiceKey,
} from "@/lib/schema";
import {
  addressSchema,
  dobSchema,
  emailSchema,
  fullNameSchema,
  isPakistaniPhone,
  isValidCityName,
  isValidIntlPhone,
  normalizePkPhone,
  toE164,
} from "@/lib/intake/validators";
import {
  countryHasStates,
  countryNameOf,
  isCityInProvince,
  stateNameOf,
} from "@/lib/intake/locations";

/* ------------------------------------------------------------------ */
/* Reusable per-nationality field rules                                */
/* ------------------------------------------------------------------ */

const pkPhoneField = z
  .string()
  .min(1, "Please enter your phone number.")
  .refine(
    isPakistaniPhone,
    "Enter a valid Pakistani mobile number (03XX-XXXXXXX or +92 3XX XXXXXXX)."
  );

const provinceField = z
  .string()
  .min(1, "Please select your province.")
  .refine(
    (value) => (PROVINCES as readonly string[]).includes(value),
    "Please select your province."
  );

const cityField = z.string().trim().min(2, "Please enter your city.");

/**
 * A single superset schema drives one visible form, but its per-nationality
 * `superRefine` branches make it behave like three separate forms:
 * a Pakistani-citizen form (province + local phone), and Overseas-Pakistani /
 * Foreign-National forms (country + state + international phone). Each branch's
 * fields live in their own component file for easy editing.
 */
export const intakeFormSchema = z
  .object({
    nationality: z.enum(NATIONALITIES, { error: "Please select your nationality." }),

    // Shared personal details
    fullName: fullNameSchema,
    email: emailSchema,
    gender: z.enum(GENDERS, { error: "Please select your gender." }),
    dob: dobSchema,
    address: addressSchema,
    city: z.string().trim().optional(),

    // Pakistani-citizen location + phone
    province: z.string().optional(),
    phone: z.string().optional(),

    // Overseas / Foreign location + phone
    country: z.string().optional(),
    state: z.string().optional(),
    phoneCountry: z.string().optional(),
    phoneNumber: z.string().optional(),

    // Shared service step
    service: z.enum(SERVICES, { error: "Please select a service." }),
    subService: z.string().min(1, "Please select a sub-service."),
    message: z.string().trim().min(10, "Please tell us a bit more (10+ characters)."),
    consent: z
      .boolean()
      .refine((value) => value === true, "You must agree to be contacted to submit."),
  })
  .superRefine((data, ctx) => {
    // Sub-service must belong to the chosen service.
    const validSubServices: readonly string[] | undefined =
      SERVICE_SUBSERVICE_MAP[data.service as ServiceKey];
    if (!validSubServices?.includes(data.subService)) {
      ctx.addIssue({
        code: "custom",
        path: ["subService"],
        message: "Please select a valid sub-service for the chosen service.",
      });
    }

    const city = data.city?.trim() ?? "";

    if (data.nationality === "pakistani-national") {
      // Phone — Pakistani formats only.
      if (!data.phone || !isPakistaniPhone(data.phone)) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Enter a valid Pakistani mobile number (03XX-XXXXXXX or +92 3XX XXXXXXX).",
        });
      }
      // Province
      if (!data.province || !(PROVINCES as readonly string[]).includes(data.province)) {
        ctx.addIssue({ code: "custom", path: ["province"], message: "Please select your province." });
      }
      // City must fall within the selected province.
      if (city.length < 2) {
        ctx.addIssue({ code: "custom", path: ["city"], message: "Please enter your city." });
      } else if (
        data.province &&
        (PROVINCES as readonly string[]).includes(data.province) &&
        !isCityInProvince(city, data.province)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["city"],
          message: "Please enter a city that lies within the selected province.",
        });
      }
    } else {
      // Overseas Pakistani + Foreign National — international location & phone.
      if (!data.phoneCountry) {
        ctx.addIssue({ code: "custom", path: ["phoneCountry"], message: "Select a country code." });
      }
      if (!data.phoneNumber || !isValidIntlPhone(data.phoneCountry, data.phoneNumber)) {
        ctx.addIssue({
          code: "custom",
          path: ["phoneNumber"],
          message: "Enter a valid phone number for the selected country.",
        });
      }
      if (!data.country) {
        ctx.addIssue({ code: "custom", path: ["country"], message: "Please select your country." });
      }
      // Require a state only for countries that actually have them listed.
      if (data.country && countryHasStates(data.country) && !data.state) {
        ctx.addIssue({ code: "custom", path: ["state"], message: "Please select your state/region." });
      }
      // City — format/anti-gibberish check (no worldwide list to match against).
      if (city.length < 2) {
        ctx.addIssue({ code: "custom", path: ["city"], message: "Please enter your city." });
      } else if (!isValidCityName(city)) {
        ctx.addIssue({ code: "custom", path: ["city"], message: "Please enter a valid city name." });
      }
    }
  });

export type IntakeFormValues = z.infer<typeof intakeFormSchema>;

/* ------------------------------------------------------------------ */
/* Per-step schemas                                                    */
/*                                                                    */
/* The wizard cannot validate a step with react-hook-form's trigger()  */
/* against `intakeFormSchema`: that schema's per-nationality rules live */
/* in a superRefine, and Zod only runs a superRefine once the whole     */
/* object has parsed. While the user is on step 1 the step-2 fields     */
/* (service, message, consent…) are still empty, so the object never    */
/* parses, the superRefine never runs, and every conditional rule —     */
/* the Pakistani phone format, province, city-within-province — is      */
/* silently skipped, letting invalid values through to the next step.   */
/*                                                                    */
/* So each step gets a self-contained schema covering exactly its own   */
/* fields. Cross-field rules stay valid because the fields they compare */
/* always live in the same step.                                        */
/* ------------------------------------------------------------------ */

const NATIONALITY_STEP = z.object({
  nationality: z.enum(NATIONALITIES, { error: "Please select your nationality." }),
});

const SHARED_PERSONAL = {
  fullName: fullNameSchema,
  email: emailSchema,
  gender: z.enum(GENDERS, { error: "Please select your gender." }),
  dob: dobSchema,
};

const PK_PERSONAL_STEP = z.object({ ...SHARED_PERSONAL, phone: pkPhoneField });

const INTL_PERSONAL_STEP = z
  .object({
    ...SHARED_PERSONAL,
    phoneCountry: z.string().min(1, "Select a country code."),
    phoneNumber: z.string().min(1, "Please enter your phone number."),
  })
  .superRefine((data, ctx) => {
    if (!isValidIntlPhone(data.phoneCountry, data.phoneNumber)) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumber"],
        message: "Enter a valid phone number for the selected country.",
      });
    }
  });

const PK_LOCATION_STEP = z
  .object({ province: provinceField, city: cityField, address: addressSchema })
  .superRefine((data, ctx) => {
    if (!isCityInProvince(data.city, data.province)) {
      ctx.addIssue({
        code: "custom",
        path: ["city"],
        message: "Please enter a city that lies within the selected province.",
      });
    }
  });

const INTL_LOCATION_STEP = z
  .object({
    country: z.string().min(1, "Please select your country."),
    state: z.string().optional(),
    city: cityField.refine(isValidCityName, "Please enter a valid city name."),
    address: addressSchema,
  })
  .superRefine((data, ctx) => {
    // Require a state only for countries that actually have them listed.
    if (countryHasStates(data.country) && !data.state) {
      ctx.addIssue({ code: "custom", path: ["state"], message: "Please select your state/region." });
    }
  });

/**
 * The schema guarding the "Service" step. Self-contained for the same reason
 * as the details sub-steps above: the sub-service/service pairing lives in a
 * superRefine on the full schema, which never runs while the later fields are
 * still empty.
 */
export const serviceStepSchema = z
  .object({
    service: z.enum(SERVICES, { error: "Please select a service." }),
    subService: z.string().min(1, "Please select a sub-service."),
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

/** The schema guarding one sub-step of the "Your Details" step. */
export function detailsStepSchema(subStep: number, nationality: string | undefined) {
  if (subStep === 0) return NATIONALITY_STEP;
  const isPakistani = nationality === "pakistani-national";
  if (subStep === 1) return isPakistani ? PK_PERSONAL_STEP : INTL_PERSONAL_STEP;
  return isPakistani ? PK_LOCATION_STEP : INTL_LOCATION_STEP;
}

export const intakeFormDefaults: Partial<IntakeFormValues> = {
  fullName: "",
  email: "",
  city: "",
  province: "",
  phone: "",
  country: "",
  state: "",
  phoneCountry: "",
  phoneNumber: "",
  subService: "",
  message: "",
  consent: false,
};

/**
 * Collapses the superset form values into the normalized shape persisted to
 * the database (a single `phone`, province OR country/state — never both).
 *
 * The country and state dropdowns carry ISO codes as their values so the
 * dependent city lookup can filter by them; both are resolved to readable
 * names here, since that is what staff and GoHighLevel need to see.
 */
export function normalizeLead(values: IntakeFormValues): LeadInput {
  const isPakistani = values.nationality === "pakistani-national";

  const phone = isPakistani
    ? normalizePkPhone(values.phone ?? "")
    : toE164(values.phoneCountry ?? "", values.phoneNumber ?? "");

  return {
    nationality: values.nationality,
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone,
    gender: values.gender,
    dob: values.dob,
    address: values.address.trim(),
    city: (values.city ?? "").trim(),
    province: isPakistani ? values.province : undefined,
    country: isPakistani ? "Pakistan" : countryNameOf(values.country),
    state: isPakistani ? undefined : stateNameOf(values.country, values.state),
    service: values.service,
    subService: values.subService,
    message: values.message.trim(),
    consent: values.consent,
  };
}
