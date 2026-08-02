import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

/* libphonenumber's isValid() is range-strict and rejects many real numbers
   whose ranges aren't in its metadata; for lead capture we use the more
   lenient isPossible() (correct length/shape for the country). */

/* ------------------------------------------------------------------ */
/* Full name                                                          */
/* Blocks disallowed symbols and obvious keyboard-mash gibberish.     */
/* This is a best-effort heuristic — it can't truly verify a name is  */
/* real, and staff review remains the reliable safeguard.             */
/* ------------------------------------------------------------------ */

// Only letters (any script), spaces and apostrophes. Explicitly keeps out the
// characters the client asked to reject: _ - ! @ , . < > ? = + and digits.
const NAME_ALLOWED = /^[\p{L}][\p{L} '’]*$/u;

const CONSONANTS_RUN = /[bcdfghjklmnpqrstvwxz]{4,}/i;
const SAME_CHAR_RUN = /([a-z])\1\1/i;

/**
 * Heuristic gibberish check applied per word. Only ASCII-ish words are judged
 * (accented / non-Latin scripts are accepted as-is), so it never penalises
 * legitimate international names it can't reason about.
 */
export function isRealisticName(value: string): boolean {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return false;

  for (const word of words) {
    // Judge only plain Latin words; leave accented / other scripts alone.
    if (!/^[a-z'’]+$/i.test(word)) continue;

    const letters = word.replace(/[^a-z]/gi, "");
    if (letters.length < 2) continue; // single-letter initials are fine

    // No run of 4+ consonants (catches "nasbjhabdiabi" → "sbjh").
    if (CONSONANTS_RUN.test(letters)) return false;
    // No character repeated 3+ times in a row ("aaaa").
    if (SAME_CHAR_RUN.test(letters)) return false;
    // Vowel checks only for longer words, so genuine short surnames like
    // "Ng", "Wu" or "Ba" aren't wrongly rejected.
    if (letters.length >= 4) {
      if (!/[aeiouy]/i.test(letters)) return false;
      const vowels = (letters.match(/[aeiouy]/gi) ?? []).length;
      if (vowels / letters.length < 0.2) return false;
    }
  }
  return true;
}

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name.")
  .max(60, "That name looks too long.")
  .regex(NAME_ALLOWED, "Name can only contain letters, spaces and apostrophes.")
  .refine(isRealisticName, "Please enter your real, full name.");

/* ------------------------------------------------------------------ */
/* Email — default validation accepts every provider worldwide.       */
/* ------------------------------------------------------------------ */
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .pipe(z.email("Please enter a valid email address."));

/* ------------------------------------------------------------------ */
/* Date of birth — not today/future, and at least 14 years old.       */
/* ------------------------------------------------------------------ */
export const MIN_AGE_YEARS = 14;

function ageInYears(dob: Date, now = new Date()): number {
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export const dobSchema = z
  .string()
  .min(1, "Please enter your date of birth.")
  .pipe(z.iso.date("Please enter a valid date of birth."))
  .refine((value) => {
    const dob = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dob < today; // rules out today and any future date
  }, "Date of birth cannot be today or in the future.")
  .refine(
    (value) => ageInYears(new Date(`${value}T00:00:00`)) >= MIN_AGE_YEARS,
    `You must be at least ${MIN_AGE_YEARS} years old.`
  );

/* ------------------------------------------------------------------ */
/* Address                                                            */
/* ------------------------------------------------------------------ */
export const addressSchema = z
  .string()
  .trim()
  .min(5, "Please enter your full address.")
  .max(200, "That address looks too long.");

/* ------------------------------------------------------------------ */
/* City name (international)                                          */
/*                                                                    */
/* Cities are chosen from a dropdown wherever we have data, so this    */
/* only guards the free-text fallback used for places the dataset      */
/* doesn't cover. It is a charset/length check, NOT an anti-gibberish  */
/* heuristic: the name-style vowel and consonant-run rules reject      */
/* thousands of genuine toponyms ("Ptghni", "Khndzoresk", "Shëngjin"), */
/* The allowed set below accepts all 148,038 names in the source       */
/* dataset, so the dropdown can never offer a city this rule refuses.  */
/* ------------------------------------------------------------------ */
const CITY_ALLOWED = /^[\p{L}\p{N}'’‘ʻ][\p{L}\p{M}\p{N} '’‘ʻ.,\-\/()&[\]]*$/u;

export function isValidCityName(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 2 || trimmed.length > 60) return false;
  if (!CITY_ALLOWED.test(trimmed)) return false;
  // Must contain at least one letter, so "123" or "---" can't pass.
  return /\p{L}/u.test(trimmed);
}

/* ------------------------------------------------------------------ */
/* Pakistani phone number                                             */
/*                                                                    */
/* Every Pakistani mobile is the country code 92 plus a 10-digit       */
/* national number starting with 3. People write that a lot of ways,   */
/* and all of them are accepted:                                       */
/*                                                                    */
/*   03001234567       local form, 11 digits                          */
/*   3001234567        national number without the trunk 0             */
/*   +923001234567     international form                              */
/*   +9203001234567    international form with the trunk 0 kept        */
/*   00923001234567    00 instead of +  (with or without the trunk 0)  */
/*                                                                    */
/* Spaces, dashes, dots and brackets are ignored throughout. Whatever   */
/* the user types is normalised to a single canonical E.164 value so    */
/* the database, GHL and WhatsApp all see the same string.             */
/* ------------------------------------------------------------------ */
const PK_DIAL_CODE = "92";
const PK_NATIONAL = /^3\d{9}$/;

/** Returns the canonical "+923XXXXXXXXX" form, or null when not a valid PK mobile. */
export function parsePkPhone(value: string): string | null {
  if (!value) return null;

  // Digits only — the +, spaces, dashes and brackets carry no information here.
  let digits = value.replace(/\D/g, "");

  // "00" is the international prefix written out.
  if (digits.startsWith("00")) digits = digits.slice(2);

  // Strip the country code when present. A national number always starts with
  // 3 (or 03), so a leading "92" is unambiguous.
  if (digits.startsWith(PK_DIAL_CODE)) digits = digits.slice(PK_DIAL_CODE.length);

  // Drop the trunk prefix if the user kept it.
  if (digits.startsWith("0")) digits = digits.slice(1);

  return PK_NATIONAL.test(digits) ? `+${PK_DIAL_CODE}${digits}` : null;
}

/** Canonical E.164 for storage; falls back to the trimmed input if unparseable. */
export function normalizePkPhone(value: string): string {
  return parsePkPhone(value) ?? value.trim();
}

export function isPakistaniPhone(value: string): boolean {
  return parsePkPhone(value) !== null;
}

/* ------------------------------------------------------------------ */
/* International phone (country ISO + national number)                */
/* ------------------------------------------------------------------ */
export function isValidIntlPhone(countryIso: string | undefined, number: string | undefined): boolean {
  if (!countryIso || !number || !number.trim()) return false;
  try {
    const parsed = parsePhoneNumberFromString(number, countryIso as never);
    return !!parsed && parsed.isPossible();
  } catch {
    return false;
  }
}

/** Returns the E.164 form (e.g. "+441234567890") or the raw number if parsing fails. */
export function toE164(countryIso: string, number: string): string {
  try {
    const parsed = parsePhoneNumberFromString(number, countryIso as never);
    if (parsed && parsed.isPossible()) return parsed.number;
  } catch {
    /* fall through */
  }
  return number.trim();
}
