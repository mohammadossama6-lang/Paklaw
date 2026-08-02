"use client";

import { useEffect, useMemo, useState } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

import type { IntakeFormValues } from "@/lib/intake/form-schema";
import type { FieldProps } from "@/components/intake/fields";
import { errorClass, inputClass, labelClass } from "@/components/intake/fields";
import SearchableSelect, { type SearchOption } from "@/components/intake/searchable-select";

type Props = FieldProps & {
  countryIso: string | undefined;
  /** ISO-3166-2 subdivision code, or undefined for countries with no state list. */
  stateCode: string | undefined;
  watch: UseFormWatch<IntakeFormValues>;
  setValue: UseFormSetValue<IntakeFormValues>;
};

type Lookup = { key: string; cities: string[] };

/**
 * Searchable city picker filtered by the chosen country + state.
 *
 * The worldwide list is ~148k cities, so it is never bundled: options are
 * fetched from /api/locations/cities once a country has been picked. Even one
 * country can return thousands, which is why this is a search field rather
 * than a plain dropdown. Where the dataset has no cities for a place — or the
 * request fails — it falls back to a text box so nobody is ever stuck.
 *
 * Results are stored with the key they were fetched for, so rendered state is
 * derived by comparing keys rather than reset inside an effect.
 */
export default function CitySelect({
  register,
  errors,
  countryIso,
  stateCode,
  watch,
  setValue,
}: Props) {
  const lookupKey = countryIso ? `${countryIso}|${stateCode ?? ""}` : "";

  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const city = watch("city");

  useEffect(() => {
    if (!lookupKey) return;

    const [country, state] = lookupKey.split("|");
    const params = new URLSearchParams({ country });
    if (state) params.set("state", state);

    const controller = new AbortController();

    fetch(`/api/locations/cities?${params}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("lookup failed"))))
      .then((data: { cities?: string[] }) =>
        setLookup({ key: lookupKey, cities: data.cities ?? [] })
      )
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

  const cityOptions = useMemo<SearchOption[]>(
    () => (cities ?? []).map((name) => ({ value: name, label: name })),
    [cities]
  );

  const useDropdown = cityOptions.length > 0;

  return (
    <div className="sm:col-span-2">
      <label htmlFor="city" className={labelClass}>
        City
      </label>

      {useDropdown ? (
        <SearchableSelect
          id="city"
          options={cityOptions}
          value={city}
          onChange={(v) => setValue("city", v, { shouldValidate: true })}
          placeholder="Select city"
          searchPlaceholder="Search cities…"
          invalid={Boolean(errors.city)}
        />
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
          className={inputClass}
        />
      )}

      {errors.city && <p className={errorClass}>{errors.city.message}</p>}
    </div>
  );
}
