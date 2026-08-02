"use client";

import { useEffect, useState } from "react";

import type { FieldProps } from "@/components/intake/fields";
import { errorClass, inputClass, labelClass } from "@/components/intake/fields";

type Props = FieldProps & {
  countryIso: string | undefined;
  /** ISO-3166-2 subdivision code, or undefined for countries with no state list. */
  stateCode: string | undefined;
};

type Lookup = { key: string; cities: string[] };

/**
 * City dropdown filtered by the chosen country + state.
 *
 * The worldwide list is ~148k cities, so it is never bundled: options are
 * fetched from /api/locations/cities once a country has been picked. Where the
 * dataset has no cities for a place — or the request fails — the field falls
 * back to a plain text box so nobody is ever stuck.
 *
 * Results are stored together with the key they were fetched for, so the
 * rendered state is derived by comparing keys rather than by resetting state
 * inside an effect (which would cascade renders).
 */
export default function CitySelect({ register, errors, countryIso, stateCode }: Props) {
  const lookupKey = countryIso ? `${countryIso}|${stateCode ?? ""}` : "";

  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [failedKey, setFailedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!lookupKey) return;

    const [country, state] = lookupKey.split("|");
    const params = new URLSearchParams({ country });
    if (state) params.set("state", state);

    const controller = new AbortController();

    fetch(`/api/locations/cities?${params}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("lookup failed"))))
      .then((data: { cities?: string[] }) => setLookup({ key: lookupKey, cities: data.cities ?? [] }))
      .catch(() => {
        // An aborted request is a superseded lookup, not a failure. The reason
        // is a DOMException, which is not `instanceof Error` in Chrome, so ask
        // the signal rather than sniffing the error.
        if (controller.signal.aborted) return;
        setFailedKey(lookupKey); // degrade to free text rather than block the form
      });

    return () => controller.abort();
  }, [lookupKey]);

  const cities = lookup?.key === lookupKey ? lookup.cities : null;
  const failed = failedKey === lookupKey;
  const loading = Boolean(lookupKey) && cities === null && !failed;
  const useDropdown = cities !== null && cities.length > 0;

  return (
    <div className="sm:col-span-2">
      <label htmlFor="city" className={labelClass}>
        City
      </label>

      {useDropdown ? (
        <select id="city" {...register("city")} className={inputClass}>
          <option value="">Select city</option>
          {cities.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      ) : (
        <input
          id="city"
          type="text"
          autoComplete="address-level2"
          disabled={loading || !countryIso}
          placeholder={
            !countryIso
              ? "Choose a country first"
              : loading
                ? "Loading cities…"
                : "Enter your city"
          }
          {...register("city")}
          className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-muted`}
        />
      )}

      {errors.city && <p className={errorClass}>{errors.city.message}</p>}
    </div>
  );
}
