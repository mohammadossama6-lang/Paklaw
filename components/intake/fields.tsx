"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { IntakeFormValues } from "@/lib/intake/form-schema";
import { GENDER_OPTIONS } from "@/lib/constants";

/* Field styling for the intake form. Uses the site's brand/ink/muted tokens
   rather than a one-off blue, so the form reads as part of the same design. */
export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-ink shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-brand-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:shadow-none";
export const labelClass =
  "mb-1 block text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500";
export const errorClass = "mt-1.5 flex items-start gap-1 text-sm text-red-600";

export type FieldProps = {
  register: UseFormRegister<IntakeFormValues>;
  errors: FieldErrors<IntakeFormValues>;
};

/**
 * Fields shared verbatim by all three nationality forms. The nationality-
 * specific bits (phone + location) live in each nationality's own file.
 */

export function NameField({ register, errors }: FieldProps) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor="fullName" className={labelClass}>
        Full Name
      </label>
      <input
        id="fullName"
        type="text"
        autoComplete="name"
        placeholder="e.g. Ayesha Khan"
        {...register("fullName")}
        className={inputClass}
      />
      {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
    </div>
  );
}

export function EmailField({ register, errors }: FieldProps) {
  return (
    <div>
      <label htmlFor="email" className={labelClass}>
        Email
      </label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        {...register("email")}
        className={inputClass}
      />
      {errors.email && <p className={errorClass}>{errors.email.message}</p>}
    </div>
  );
}

export function GenderField({ register, errors }: FieldProps) {
  return (
    <div>
      <label htmlFor="gender" className={labelClass}>
        Gender
      </label>
      <select id="gender" {...register("gender")} className={inputClass} defaultValue="">
        <option value="" disabled>
          Select gender
        </option>
        {GENDER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
    </div>
  );
}

export function DobField({ register, errors }: FieldProps) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div>
      <label htmlFor="dob" className={labelClass}>
        Date of Birth
      </label>
      <input
        id="dob"
        type="date"
        max={today}
        placeholder="YYYY-MM-DD"
        {...register("dob")}
        className={inputClass}
      />
      {errors.dob && <p className={errorClass}>{errors.dob.message}</p>}
    </div>
  );
}

export function AddressField({ register, errors }: FieldProps) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor="address" className={labelClass}>
        Address
      </label>
      <input
        id="address"
        type="text"
        autoComplete="street-address"
        placeholder="House no. 33, Street no. 44, F-5, Islamabad, Pakistan"
        {...register("address")}
        className={inputClass}
      />
      {errors.address && <p className={errorClass}>{errors.address.message}</p>}
    </div>
  );
}
