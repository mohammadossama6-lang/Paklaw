import { z } from "zod";

import { requestOtpSchema } from "@/lib/auth-schema";
import { requestOtp } from "@/lib/otp";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestOtpSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: "Please enter a valid phone number.", errors: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    );
  }

  await requestOtp(parsed.data.phone);

  return Response.json({ ok: true });
}
