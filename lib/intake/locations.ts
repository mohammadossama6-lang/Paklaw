import countriesData from "./data/countries.json";
import statesData from "./data/states.json";
import pkCitiesData from "./data/pk-cities.json";

export type CountryOption = {
  iso: string;
  name: string;
  dialCode: string;
  flag: string;
};

export type StateOption = {
  /** ISO-3166-2 subdivision code — what /api/locations/cities filters by. */
  code: string;
  name: string;
};

export const COUNTRIES = countriesData as CountryOption[];

const STATES_BY_COUNTRY = statesData as Record<string, StateOption[]>;
const PK_CITIES_BY_PROVINCE = pkCitiesData as Record<string, string[]>;

const COUNTRY_BY_ISO = new Map(COUNTRIES.map((c) => [c.iso, c]));

export function countryByIso(iso: string | undefined): CountryOption | undefined {
  return iso ? COUNTRY_BY_ISO.get(iso) : undefined;
}

/** States/regions for a country ISO — empty array when the dataset has none. */
export function statesOf(iso: string | undefined): StateOption[] {
  return iso ? STATES_BY_COUNTRY[iso] ?? [] : [];
}

export function countryHasStates(iso: string | undefined): boolean {
  return statesOf(iso).length > 0;
}

/**
 * The state dropdown's values are subdivision codes (so cities can be looked
 * up), but we persist the human-readable name. Falls back to the raw value for
 * countries with no state list, where the field is free text.
 */
export function stateNameOf(countryIso: string | undefined, stateCode: string | undefined): string {
  if (!stateCode) return "";
  const match = statesOf(countryIso).find((s) => s.code === stateCode);
  return match?.name ?? stateCode;
}

/** The country's display name, falling back to the raw ISO if unknown. */
export function countryNameOf(iso: string | undefined): string {
  if (!iso) return "";
  return countryByIso(iso)?.name ?? iso;
}

/* ------------------------------------------------------------------ */
/* Pakistan city ↔ province jurisdiction check.                        */
/* Coverage is the country-state-city dataset (major cities/towns per  */
/* province); comparison is case/punctuation-insensitive.              */
/* ------------------------------------------------------------------ */
const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

export function citiesOfProvince(provinceKey: string): string[] {
  return PK_CITIES_BY_PROVINCE[provinceKey] ?? [];
}

export function isCityInProvince(city: string, provinceKey: string): boolean {
  const list = PK_CITIES_BY_PROVINCE[provinceKey];
  if (!list || !city) return false;
  const target = normalize(city);
  if (!target) return false;
  return list.some((known) => normalize(known) === target);
}
