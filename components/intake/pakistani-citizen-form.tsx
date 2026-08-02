"use client";

import type { FieldProps } from "@/components/intake/fields";
import {
  AddressField,
  DobField,
  EmailField,
  GenderField,
  NameField,
  errorClass,
  inputClass,
  labelClass,
} from "@/components/intake/fields";
import { PROVINCE_OPTIONS } from "@/lib/constants";

/* -------------------------------------------------------------------------- */
/* Pakistani Citizen form                                                      */
/* Local phone (+92 / 03…) and a Pakistani province + city.                    */
/* -------------------------------------------------------------------------- */

export function PakistaniCitizenPersonalFields({ register, errors }: FieldProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <NameField register={register} errors={errors} />
      <EmailField register={register} errors={errors} />

      {/* Full width so the rows pair up as Name+Email, Phone, Gender+DOB —
          matching the overseas/foreign forms, whose phone field spans the row
          because of its country-code picker. */}
      <div className="sm:col-span-2">
        <label htmlFor="phone" className={labelClass}>
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="03XX-XXXXXXX or +92 3XX XXXXXXX"
          {...register("phone")}
          className={inputClass}
        />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      <GenderField register={register} errors={errors} />
      <DobField register={register} errors={errors} />
    </div>
  );
}

export function PakistaniCitizenLocationFields({ register, errors }: FieldProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="province" className={labelClass}>
          Province
        </label>
        <select id="province" {...register("province")} defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select province
          </option>
          {PROVINCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.province && <p className={errorClass}>{errors.province.message}</p>}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="city" className={labelClass}>
          City
        </label>
        <input
          id="city"
          type="text"
          autoComplete="address-level2"
          placeholder="e.g. Lahore"
          {...register("city")}
          className={inputClass}
        />
        {errors.city && <p className={errorClass}>{errors.city.message}</p>}
      </div>

      <AddressField register={register} errors={errors} />
    </div>
  );
}
