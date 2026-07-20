import { z } from "zod";

export const requestOtpSchema = z.object({
  phone: z.string().min(7, "Please enter a valid phone number.").max(20, "Please enter a valid phone number."),
});

export const verifyOtpSchema = requestOtpSchema.extend({
  code: z.string().length(6, "Enter the 6-digit code."),
});

export type RequestOtpValues = z.infer<typeof requestOtpSchema>;
export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;
