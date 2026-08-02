"use client";

import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

import type { IntakeFormValues } from "@/lib/intake/form-schema";
import type { FieldProps } from "@/components/intake/fields";
import { AddressField, errorClass, inputClass, labelClass } from "@/components/intake/fields";
import CitySelect from "@/components/intake/city-select";
import { COUNTRIES, statesOf } from "@/lib/intake/locations";

type Props = FieldProps & {
  watch: UseFormWatch<IntakeFormValues>;
  setValue: UseFormSetValue<IntakeFormValues>;
};

/**
 * Country → State → City dependent dropdowns (full world lists) plus Address.
 * Shared by the Overseas-Pakistani and Foreign-National forms.
 *
 * The state field's *value* is the ISO-3166-2 subdivision code, because that is
 * what the city lookup filters by; normalizeLead() converts it back to the
 * readable name before the lead is stored.
 */
export default function InternationalLocationFields({ register, errors, watch, setValue }: Props) {
  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const states = statesOf(selectedCountry);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor="country" className={labelClass}>
          Country
        </label>
        <select
          id="country"
          {...register("country")}
          defaultValue=""
          onChange={(e) => {
            setValue("country", e.target.value, { shouldValidate: true });
            // Both dependents are stale the moment the country changes.
            setValue("state", "", { shouldValidate: false });
            setValue("city", "", { shouldValidate: false });
          }}
          className={inputClass}
        >
          <option value="" disabled>
            Select country
          </option>
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
        {errors.country && <p className={errorClass}>{errors.country.message}</p>}
      </div>

      <div>
        <label htmlFor="state" className={labelClass}>
          State / Region
        </label>
        {states.length > 0 ? (
          <select
            id="state"
            {...register("state")}
            disabled={!selectedCountry}
            onChange={(e) => {
              setValue("state", e.target.value, { shouldValidate: true });
              // The city list is filtered by state, so the old pick is stale.
              setValue("city", "", { shouldValidate: false });
            }}
            className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-muted`}
          >
            <option value="">
              {selectedCountry ? "Select state/region" : "Choose a country first"}
            </option>
            {states.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="state"
            type="text"
            placeholder={selectedCountry ? "Enter your state/region" : "Choose a country first"}
            disabled={!selectedCountry}
            {...register("state")}
            className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-muted`}
          />
        )}
        {errors.state && <p className={errorClass}>{errors.state.message}</p>}
      </div>

      <CitySelect
        register={register}
        errors={errors}
        countryIso={selectedCountry}
        stateCode={states.length > 0 ? selectedState : undefined}
      />

      <AddressField register={register} errors={errors} />
    </div>
  );
}
