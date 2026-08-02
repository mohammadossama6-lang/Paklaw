"use client";

import { useMemo } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

import type { IntakeFormValues } from "@/lib/intake/form-schema";
import type { FieldProps } from "@/components/intake/fields";
import { AddressField, errorClass, inputClass, labelClass } from "@/components/intake/fields";
import CitySelect from "@/components/intake/city-select";
import SearchableSelect, { type SearchOption } from "@/components/intake/searchable-select";
import { COUNTRIES, statesOf } from "@/lib/intake/locations";

type Props = FieldProps & {
  watch: UseFormWatch<IntakeFormValues>;
  setValue: UseFormSetValue<IntakeFormValues>;
};

/**
 * Country → State → City dependent pickers (full world lists) plus Address.
 * Shared by the Overseas-Pakistani and Foreign-National forms.
 *
 * Country shows the full name ("Pakistan") and is searchable; the state field's
 * *value* is the ISO-3166-2 subdivision code, because that is what the city
 * lookup filters by. normalizeLead() converts both back to readable names
 * before the lead is stored.
 */
export default function InternationalLocationFields({ register, errors, watch, setValue }: Props) {
  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const states = statesOf(selectedCountry);

  const countryOptions = useMemo<SearchOption[]>(
    () =>
      COUNTRIES.map((c) => ({
        value: c.iso,
        label: c.name,
        prefix: c.flag,
        keywords: `${c.iso} ${c.dialCode}`,
      })),
    []
  );

  const stateOptions = useMemo<SearchOption[]>(
    () => states.map((s) => ({ value: s.code, label: s.name })),
    [states]
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="country" className={labelClass}>
          Country
        </label>
        <SearchableSelect
          id="country"
          options={countryOptions}
          value={selectedCountry}
          onChange={(v) => {
            setValue("country", v, { shouldValidate: true });
            // Both dependents are stale the moment the country changes.
            setValue("state", "", { shouldValidate: false });
            setValue("city", "", { shouldValidate: false });
          }}
          placeholder="Select country"
          searchPlaceholder="Search countries…"
          invalid={Boolean(errors.country)}
        />
        {errors.country && <p className={errorClass}>{errors.country.message}</p>}
      </div>

      <div>
        <label htmlFor="state" className={labelClass}>
          State / Region
        </label>
        {states.length > 0 ? (
          <SearchableSelect
            id="state"
            options={stateOptions}
            value={selectedState}
            onChange={(v) => {
              setValue("state", v, { shouldValidate: true });
              // The city list is filtered by state, so the old pick is stale.
              setValue("city", "", { shouldValidate: false });
            }}
            placeholder={selectedCountry ? "Select state/region" : "Choose a country first"}
            searchPlaceholder="Search states…"
            disabled={!selectedCountry}
            invalid={Boolean(errors.state)}
          />
        ) : (
          <input
            id="state"
            type="text"
            placeholder={selectedCountry ? "Enter your state/region" : "Choose a country first"}
            disabled={!selectedCountry}
            {...register("state")}
            className={inputClass}
          />
        )}
        {errors.state && <p className={errorClass}>{errors.state.message}</p>}
      </div>

      <CitySelect
        register={register}
        errors={errors}
        countryIso={selectedCountry}
        stateCode={states.length > 0 ? selectedState : undefined}
        watch={watch}
        setValue={setValue}
      />

      <AddressField register={register} errors={errors} />
    </div>
  );
}
