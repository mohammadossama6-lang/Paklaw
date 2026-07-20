import { z } from "zod";

import { PROVINCES } from "@/lib/schema";

export const PRACTICE_AREAS = [
  "civil-litigation",
  "criminal-law",
  "corporate-law",
  "family-law",
  "property-law",
  "tax-law",
  "constitutional-law",
  "labor-law",
  "intellectual-property",
  "immigration-law",
] as const;

const currentYear = new Date().getFullYear();

export const lawyerApplicationSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Please enter a valid phone number."),
  city: z.string().min(2, "Please enter your city."),
  province: z.enum(PROVINCES, { error: "Please select your province." }),

  barCouncilNumber: z.string().min(2, "Please enter your Bar Council registration number."),
  yearsOfExperience: z.coerce
    .number()
    .min(0, "Please enter a valid number of years.")
    .max(70, "Please enter a valid number of years."),
  practiceAreas: z
    .array(z.enum(PRACTICE_AREAS))
    .min(1, "Please select at least one practice area."),

  lawDegree: z.string().min(2, "Please enter your law degree (e.g. LLB, LLM)."),
  university: z.string().min(2, "Please enter your university."),
  graduationYear: z.coerce
    .number()
    .min(1950, "Please enter a valid graduation year.")
    .max(currentYear, "Please enter a valid graduation year."),

  bio: z.string().min(10, "Please tell us a bit about yourself (10+ characters)."),
});

export type LawyerApplicationValues = z.infer<typeof lawyerApplicationSchema>;
// react-hook-form needs the pre-coercion shape (form fields are strings
// until zodResolver parses them), while LawyerApplicationValues above is the
// post-coercion output type used everywhere else (API route, GHL sync).
export type LawyerApplicationInput = z.input<typeof lawyerApplicationSchema>;

export const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
