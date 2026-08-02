"use client";

import { useMemo } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

import type { IntakeFormValues } from "@/lib/intake/form-schema";
import type { FieldProps } from "@/components/intake/fields";
import { errorClass, inputClass, labelClass } from "@/components/intake/fields";
import SearchableSelect, { type SearchOption } from "@/components/intake/searchable-select";
import { COUNTRIES } from "@/lib/intake/locations";

type Props = FieldProps & {
  watch: UseFormWatch<IntakeFormValues>;
  setValue: UseFormSetValue<IntakeFormValues>;
};

/**
 * International phone entry: a searchable country-code picker plus the national
 * number. The picker shows the ISO code and dial code ("PK +92") so it stays
 * narrow beside the number, but it searches the full country name too — typing
 * "pakistan", "pk" or "92" all find it.
 */
export default function IntlPhoneField({ register, errors, watch, setValue }: Props) {
  const phoneCountry = watch("phoneCountry");

  const codeOptions = useMemo<SearchOption[]>(
    () =>
      COUNTRIES.map((c) => ({
        value: c.iso,
        label: `${c.iso} ${c.dialCode}`,
        prefix: c.flag,
        keywords: `${c.name} ${c.dialCode.replace("+", "")}`,
      })),
    []
  );

  return (
    <div className="sm:col-span-2">
      <label htmlFor="phoneCountry" className={labelClass}>
        Phone Number
      </label>
      <div className="flex gap-2">
        <SearchableSelect
          id="phoneCountry"
          options={codeOptions}
          value={phoneCountry}
          onChange={(v) => setValue("phoneCountry", v, { shouldValidate: true })}
          placeholder="Code"
          searchPlaceholder="Search country or code…"
          invalid={Boolean(errors.phoneCountry)}
          className="w-[7.5rem] shrink-0 sm:w-[9.5rem]"
        />
        <input
          id="phoneNumber"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="300 1234567"
          {...register("phoneNumber")}
          className={`${inputClass} flex-1`}
        />
      </div>
      {errors.phoneCountry && <p className={errorClass}>{errors.phoneCountry.message}</p>}
      {errors.phoneNumber && <p className={errorClass}>{errors.phoneNumber.message}</p>}
    </div>
  );
}
