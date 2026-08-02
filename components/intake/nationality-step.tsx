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
              className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-slate-200 p-3 text-center transition-all hover:-translate-y-0.5 hover:border-[#328FF8]/40 hover:shadow-md hover:shadow-[#328FF8]/10 has-checked:border-[#328FF8] has-checked:bg-[#328FF8]/5 has-checked:shadow-lg has-checked:shadow-[#328FF8]/15"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors has-checked:bg-[#328FF8] has-checked:text-white">
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
