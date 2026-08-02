"use client";

import type { FieldProps } from "@/components/intake/fields";
import { errorClass, inputClass, labelClass } from "@/components/intake/fields";
import { COUNTRIES } from "@/lib/intake/locations";

/**
 * International phone entry: a country-code dropdown (every country in the
 * world) plus a national-number box. The chosen country ISO drives
 * per-country validation via libphonenumber-js in the form schema.
 */
export default function IntlPhoneField({ register, errors }: FieldProps) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor="phoneNumber" className={labelClass}>
        Phone Number
      </label>
      <div className="flex gap-2">
        <select
          aria-label="Country code"
          {...register("phoneCountry")}
          defaultValue=""
          className={`${inputClass} w-auto max-w-[8.5rem] shrink-0`}
        >
          <option value="" disabled>
            Code
          </option>
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.flag} {c.iso} {c.dialCode}
            </option>
          ))}
        </select>
        <input
          id="phoneNumber"
          type="tel"
          autoComplete="tel-national"
          placeholder="Phone number"
          {...register("phoneNumber")}
          className={`${inputClass} flex-1`}
        />
      </div>
      {errors.phoneCountry && <p className={errorClass}>{errors.phoneCountry.message}</p>}
      {errors.phoneNumber && <p className={errorClass}>{errors.phoneNumber.message}</p>}
    </div>
  );
}
