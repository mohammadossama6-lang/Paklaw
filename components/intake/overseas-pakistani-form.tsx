"use client";

import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

import type { IntakeFormValues } from "@/lib/intake/form-schema";
import type { FieldProps } from "@/components/intake/fields";
import { DobField, EmailField, GenderField, NameField } from "@/components/intake/fields";
import IntlPhoneField from "@/components/intake/intl-phone-field";
import InternationalLocationFields from "@/components/intake/international-location-fields";

/* -------------------------------------------------------------------------- */
/* Overseas Pakistani form                                                     */
/* International phone (country-code dropdown) + country/state/city location.   */
/* -------------------------------------------------------------------------- */

export function OverseasPakistaniPersonalFields({
  register,
  errors,
  watch,
  setValue,
}: FieldProps & {
  watch: UseFormWatch<IntakeFormValues>;
  setValue: UseFormSetValue<IntakeFormValues>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <NameField register={register} errors={errors} />
      <EmailField register={register} errors={errors} />
      <IntlPhoneField
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />
      <GenderField register={register} errors={errors} />
      <DobField register={register} errors={errors} />
    </div>
  );
}

export function OverseasPakistaniLocationFields({
  register,
  errors,
  watch,
  setValue,
}: FieldProps & {
  watch: UseFormWatch<IntakeFormValues>;
  setValue: UseFormSetValue<IntakeFormValues>;
}) {
  return (
    <InternationalLocationFields
      register={register}
      errors={errors}
      watch={watch}
      setValue={setValue}
    />
  );
}
