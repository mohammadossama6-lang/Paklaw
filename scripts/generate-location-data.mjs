/**
 * Regenerates the bundled location datasets under lib/intake/data/.
 *
 *   node scripts/generate-location-data.mjs
 *
 * Source of truth is the `country-state-city` package, except for dial codes,
 * which come from libphonenumber-js (country-state-city's own `phonecode`
 * field is dirty — "++1-684", "++1-809 and 1-829" — and would render badly in
 * the country-code dropdown).
 *
 * World cities are NOT bundled: at ~148k entries they would dominate the page
 * weight, so they are served on demand by /api/locations/cities instead.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pkg from "country-state-city";
import { getCountryCallingCode, isSupportedCountry } from "libphonenumber-js";

const { Country, State, City } = pkg;

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "lib", "intake", "data");

/** 🇵🇰 from "PK" — regional indicator symbols. */
function flagOf(iso) {
  return String.fromCodePoint(
    ...[...iso.toUpperCase()].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65)
  );
}

/** "+92" — authoritative where libphonenumber knows the country. */
function dialCodeOf(iso, fallback) {
  if (isSupportedCountry(iso)) return `+${getCountryCallingCode(iso)}`;
  // Salvage the first numeric run out of country-state-city's messy value.
  const digits = String(fallback ?? "").match(/\d+/)?.[0];
  return digits ? `+${digits}` : "";
}

/* ------------------------------------------------------------------ */
/* countries.json — [{ iso, name, dialCode, flag }]                    */
/* ------------------------------------------------------------------ */
const countries = Country.getAllCountries()
  .map((c) => ({
    iso: c.isoCode,
    name: c.name,
    dialCode: dialCodeOf(c.isoCode, c.phonecode),
    flag: flagOf(c.isoCode),
  }))
  .filter((c) => c.dialCode)
  .sort((a, b) => a.name.localeCompare(b.name));

/* ------------------------------------------------------------------ */
/* states.json — { [countryIso]: [{ code, name }] }                     */
/* The code is what /api/locations/cities filters cities by.            */
/* ------------------------------------------------------------------ */
const states = {};
for (const country of countries) {
  const list = State.getStatesOfCountry(country.iso) ?? [];
  if (list.length === 0) continue;
  states[country.iso] = list
    .map((s) => ({ code: s.isoCode, name: s.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* ------------------------------------------------------------------ */
/* pk-cities.json — { [provinceKey]: string[] }                        */
/* Drives the city-belongs-to-province check for Pakistani citizens.   */
/* Keys match PROVINCES in lib/schema.ts.                              */
/* ------------------------------------------------------------------ */
const PK_PROVINCE_STATE_CODES = {
  punjab: ["PB"],
  sindh: ["SD"],
  // KPK absorbed the Federally Administered Tribal Areas in 2018, so the
  // dataset's separate "TA" entry belongs under Khyber Pakhtunkhwa now.
  kpk: ["KP", "TA"],
  balochistan: ["BA"],
  "gilgit-baltistan": ["GB"],
  "azad-kashmir": ["JK"],
  islamabad: ["IS"],
};

const pkCities = {};
for (const [provinceKey, codes] of Object.entries(PK_PROVINCE_STATE_CODES)) {
  const names = new Set();
  for (const code of codes) {
    for (const city of City.getCitiesOfState("PK", code) ?? []) names.add(city.name);
  }
  pkCities[provinceKey] = [...names].sort((a, b) => a.localeCompare(b));
}

/* ------------------------------------------------------------------ */

mkdirSync(OUT_DIR, { recursive: true });
const write = (file, data) => {
  writeFileSync(join(OUT_DIR, file), `${JSON.stringify(data)}\n`, "utf8");
  console.log(`wrote ${file}`);
};

write("countries.json", countries);
write("states.json", states);
write("pk-cities.json", pkCities);

console.log(
  `\ncountries: ${countries.length}` +
    `\ncountries with states: ${Object.keys(states).length}` +
    `\nstates total: ${Object.values(states).flat().length}` +
    `\nPK cities: ${Object.entries(pkCities)
      .map(([k, v]) => `${k}=${v.length}`)
      .join(", ")}`
);
