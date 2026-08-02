"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import {
  detailsStepSchema,
  intakeFormSchema,
  intakeFormDefaults,
  normalizeLead,
  type IntakeFormValues,
} from "@/lib/intake/form-schema";
import { SERVICE_OPTIONS, SUB_SERVICE_OPTIONS } from "@/lib/constants";
import { errorClass, inputClass, labelClass } from "@/components/intake/fields";
import NationalityStep from "@/components/intake/nationality-step";
import {
  PakistaniCitizenLocationFields,
  PakistaniCitizenPersonalFields,
} from "@/components/intake/pakistani-citizen-form";
import {
  OverseasPakistaniLocationFields,
  OverseasPakistaniPersonalFields,
} from "@/components/intake/overseas-pakistani-form";
import {
  ForeignNationalLocationFields,
  ForeignNationalPersonalFields,
} from "@/components/intake/foreign-national-form";

const STEP_LABELS = ["Your Details", "Submit"];
const TOTAL_STEPS = STEP_LABELS.length;

const DETAILS_STEP = 0;
const DETAILS_SUB_STEPS = 3; // nationality → personal → location
// Two dots sit in the progress bar between step 1 and step 2, one per
// boundary crossed inside the three-part "Your Details" step.
const DETAILS_DOTS = [0, 1];

type SubmitState = "idle" | "submitting" | "success" | "error";

/** Which fields to validate before advancing each details sub-step. */
function detailsFieldsFor(subStep: number, nationality?: string): (keyof IntakeFormValues)[] {
  const isPakistani = nationality === "pakistani-national";
  if (subStep === 0) return ["nationality"];
  if (subStep === 1) {
    return isPakistani
      ? ["fullName", "email", "phone", "gender", "dob"]
      : ["fullName", "email", "phoneCountry", "phoneNumber", "gender", "dob"];
  }
  return isPakistani ? ["province", "city", "address"] : ["country", "state", "city", "address"];
}

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [detailsSubStep, setDetailsSubStep] = useState(0);
  const [detailsSlideDirection, setDetailsSlideDirection] = useState(1);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeFormSchema),
    mode: "onTouched",
    defaultValues: intakeFormDefaults as IntakeFormValues,
  });

  const nationality = useWatch({ control, name: "nationality" });
  const selectedService = useWatch({ control, name: "service" });
  const consentChecked = useWatch({ control, name: "consent" });

  const isLastStep = step === TOTAL_STEPS - 1;
  const isFirstScreen = step === DETAILS_STEP && detailsSubStep === 0;

  /**
   * Validates the current sub-step against its own schema (see
   * detailsStepSchema for why trigger() on the full schema can't be used) and
   * pushes any issues onto the matching fields.
   */
  function validateDetailsStep(): boolean {
    const fields = detailsFieldsFor(detailsSubStep, nationality);
    clearErrors(fields);

    const result = detailsStepSchema(detailsSubStep, nationality).safeParse(getValues());
    if (result.success) return true;

    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof IntakeFormValues | undefined;
      if (field) setError(field, { type: "manual", message: issue.message });
    }

    // The modal hides its scrollbar, so an error below the fold would leave
    // Next Step looking like it does nothing. Bring the first one into view.
    // Two deliberate choices here, both found by testing:
    //  - setTimeout, not requestAnimationFrame: rAF callbacks are throttled to
    //    zero in a backgrounded or non-compositing tab, so the scroll silently
    //    never happened. A macrotask still lets React paint the errors first.
    //  - no `behavior: "smooth"`: inside the modal's transformed, animated
    //    container Chrome drops the smooth scroll and the field never moves.
    const firstField = result.error.issues[0]?.path[0];
    if (typeof firstField === "string") {
      setTimeout(() => {
        document.getElementById(firstField)?.scrollIntoView({ block: "center" });
      }, 0);
    }
    return false;
  }

  function goNext() {
    if (step !== DETAILS_STEP) return;
    if (!validateDetailsStep()) return;

    if (detailsSubStep < DETAILS_SUB_STEPS - 1) {
      setDetailsSlideDirection(1);
      setDetailsSubStep((s) => s + 1);
      return;
    }

    setStep(1);
  }

  function goBack() {
    setServerError(null);

    if (step === DETAILS_STEP && detailsSubStep > 0) {
      setDetailsSlideDirection(-1);
      setDetailsSubStep((s) => s - 1);
      return;
    }

    if (step === DETAILS_STEP + 1) {
      setDetailsSlideDirection(-1);
      setDetailsSubStep(DETAILS_SUB_STEPS - 1);
    }
    setStep((s) => Math.max(s - 1, 0));
  }

  const onSubmit = async (values: IntakeFormValues) => {
    setSubmitState("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizeLead(values)),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Something went wrong. Please try again.");
      }

      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  /**
   * Safety net: step gating should mean every details field is already valid by
   * the time Submit is reachable, but if the full schema still rejects one, the
   * message would render on a step the user can't see. Jump back to it instead
   * of appearing to do nothing.
   */
  const onInvalid = (formErrors: typeof errors) => {
    const failed = Object.keys(formErrors);
    for (let subStep = 0; subStep < DETAILS_SUB_STEPS; subStep++) {
      const fields = detailsFieldsFor(subStep, nationality) as string[];
      if (fields.some((field) => failed.includes(field))) {
        setDetailsSlideDirection(-1);
        setDetailsSubStep(subStep);
        setStep(DETAILS_STEP);
        return;
      }
    }
  };

  if (submitState === "success") {
    return (
      <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl bg-white p-10 text-center shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand-600 via-brand-500 to-gold-400" />
        <div className="flex size-16 items-center justify-center rounded-full bg-linear-to-br from-brand-600 to-brand-700 shadow-lg shadow-brand-600/30">
          <Check className="size-8 text-white" strokeWidth={3} />
        </div>
        <h3 className="font-serif text-2xl italic tracking-tight text-ink">
          Thank you — we&apos;ve received your request
        </h3>
        <p className="text-muted">
          A member of our team will reach out shortly. If your matter is
          urgent, feel free to message us directly on WhatsApp in the
          meantime.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 sm:p-7">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand-600 via-brand-500 to-gold-400"
      />

      <div className="mb-4 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
          <span aria-hidden className="h-px w-5 bg-linear-to-r from-transparent to-gold-400" />
          Free Consultation
          <span aria-hidden className="h-px w-5 bg-linear-to-l from-transparent to-gold-400" />
        </span>
        <h2 className="mt-1 font-serif text-xl italic tracking-tight text-ink sm:text-2xl">
          Schedule Your Legal Consultation
        </h2>
      </div>

      <ol className="mb-5 flex items-center" aria-label="Form progress">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                aria-current={i === step ? "step" : undefined}
                className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  i < step
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                    : i === step
                      ? "bg-linear-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-600/30 ring-4 ring-brand-500/15"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {i < step ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={`hidden text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors sm:block ${
                  i <= step ? "text-ink" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="mx-3 flex flex-1 items-center justify-center gap-2.5" aria-hidden>
                {DETAILS_DOTS.map((dot) => {
                  const filled = step > DETAILS_STEP || detailsSubStep > dot;
                  return (
                    <span
                      key={dot}
                      className={`size-2 rounded-full transition-all duration-300 ${
                        filled ? "scale-125 bg-brand-500" : "bg-slate-200"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
            {/* STEP 1 — Your details: nationality, then personal, then location */}
            {step === 0 && (
              <fieldset>
                <legend className="mb-2.5 text-base font-semibold tracking-tight text-ink">
                  {detailsSubStep === 0 ? "What is your nationality?" : "Your details"}
                </legend>
                <motion.div
                  key={detailsSubStep}
                  initial={{ opacity: 0, x: detailsSlideDirection * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {detailsSubStep === 0 && (
                      <NationalityStep register={register} errors={errors} />
                    )}

                    {detailsSubStep === 1 &&
                      (nationality === "overseas-pakistani" ? (
                        <OverseasPakistaniPersonalFields
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                        />
                      ) : nationality === "foreign-national" ? (
                        <ForeignNationalPersonalFields
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                        />
                      ) : (
                        <PakistaniCitizenPersonalFields register={register} errors={errors} />
                      ))}

                    {detailsSubStep === 2 &&
                      (nationality === "overseas-pakistani" ? (
                        <OverseasPakistaniLocationFields
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                        />
                      ) : nationality === "foreign-national" ? (
                        <ForeignNationalLocationFields
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                        />
                      ) : (
                        <PakistaniCitizenLocationFields register={register} errors={errors} />
                      ))}
                </motion.div>
              </fieldset>
            )}

            {/* STEP 2 — Service + dependent sub-service, then message/consent/submit */}
            {step === 1 && (
              <>
                <fieldset>
                  <legend className="mb-2.5 text-base font-semibold tracking-tight text-ink">
                    Which service do you need?
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="service" className={labelClass}>
                        Service
                      </label>
                      <select
                        id="service"
                        {...register("service")}
                        defaultValue=""
                        onChange={(e) => {
                          setValue("service", e.target.value as IntakeFormValues["service"], {
                            shouldValidate: true,
                          });
                          setValue("subService", "", { shouldValidate: false });
                        }}
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select a service
                        </option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.service && <p className={errorClass}>{errors.service.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="subService" className={labelClass}>
                        Sub-service
                      </label>
                      <select
                        id="subService"
                        {...register("subService")}
                        disabled={!selectedService}
                        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-muted`}
                      >
                        <option value="">
                          {selectedService ? "Select a sub-service" : "Choose a service first"}
                        </option>
                        {selectedService &&
                          SUB_SERVICE_OPTIONS[selectedService].map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                      </select>
                      {errors.subService && (
                        <p className={errorClass}>{errors.subService.message}</p>
                      )}
                    </div>
                  </div>
                </fieldset>

                <fieldset className="mt-5">
                  <legend className="mb-2.5 text-base font-semibold tracking-tight text-ink">
                    Tell us about your matter
                  </legend>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="message" className={labelClass}>
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        {...register("message")}
                        className={inputClass}
                        placeholder="Briefly describe your situation..."
                      />
                      {errors.message && <p className={errorClass}>{errors.message.message}</p>}
                    </div>

                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={consentChecked ?? false}
                        onChange={(e) =>
                          setValue("consent", e.target.checked, { shouldValidate: true })
                        }
                        className="mt-1 size-4 accent-brand-600"
                      />
                      <span className="text-sm text-muted">
                        I agree to be contacted by Pak Law regarding my inquiry, and I
                        accept the{" "}
                        <Link
                          href="/terms"
                          target="_blank"
                          className="font-medium text-brand-600 underline underline-offset-2 transition-colors hover:text-brand-700"
                        >
                          Terms &amp; Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          target="_blank"
                          className="font-medium text-brand-600 underline underline-offset-2 transition-colors hover:text-brand-700"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.consent && <p className={errorClass}>{errors.consent.message}</p>}

                    {submitState === "error" && serverError && (
                      <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
                        {serverError}
                      </p>
                    )}
                  </div>
                </fieldset>
              </>
            )}
        </motion.div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
          {isFirstScreen ? (
            <span aria-hidden />
          ) : (
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl px-4 py-2.5 font-medium text-muted transition-colors hover:bg-slate-100 hover:text-ink"
            >
              Back
            </button>
          )}

          {!isLastStep ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 rounded-xl bg-linear-to-br from-brand-600 to-brand-700 px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:shadow-xl hover:shadow-brand-600/35 hover:brightness-110 active:scale-[0.98]"
            >
              Next Step
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="flex items-center gap-2 rounded-xl bg-linear-to-br from-brand-600 to-brand-700 px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:shadow-xl hover:shadow-brand-600/35 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitState === "submitting" && <Loader2 className="size-4 animate-spin" />}
              {submitState === "submitting" ? "Submitting..." : "Submit request"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
