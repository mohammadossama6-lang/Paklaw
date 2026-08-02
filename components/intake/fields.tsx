"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { IntakeFormValues } from "@/lib/intake/form-schema";
import { GENDER_OPTIONS } from "@/lib/constants";

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-ink outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#328FF8] focus:bg-white focus:ring-4 focus:ring-[#328FF8]/10";
export const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
export const errorClass = "mt-1.5 text-sm text-red-500";

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
