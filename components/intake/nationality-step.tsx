"use client";

import { Globe, IdCard, Plane } from "lucide-react";

import type { FieldProps } from "@/components/intake/fields";
import { errorClass } from "@/components/intake/fields";
import { NATIONALITY_OPTIONS } from "@/lib/constants";

const NATIONALITY_ICONS: Record<string, typeof IdCard> = {
  "pakistani-national": IdCard,
  "overseas-pakistani": Plane,
  "foreign-national": Globe,
};

export default function NationalityStep({ register, errors }: FieldProps) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {NATIONALITY_OPTIONS.map((opt) => {
          const Icon = NATIONALITY_ICONS[opt.value];
          return (
            <label
              key={opt.value}
              className="flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md hover:shadow-brand-600/10 has-checked:border-brand-600 has-checked:bg-brand-50/60 has-checked:shadow-lg has-checked:shadow-brand-600/15 has-checked:ring-1 has-checked:ring-brand-600/20"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors has-checked:bg-linear-to-br has-checked:from-brand-600 has-checked:to-brand-700 has-checked:text-white">
                <input type="radio" value={opt.value} {...register("nationality")} className="sr-only" />
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-medium text-ink">{opt.label}</span>
            </label>
          );
        })}
      </div>
      {errors.nationality && (
        <p className={errorClass} role="alert">
          {errors.nationality.message}
        </p>
      )}
    </div>
  );
}
