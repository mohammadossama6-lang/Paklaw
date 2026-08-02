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

  // If the code can't actually be delivered, say so — returning ok:true would
  // leave the user staring at a code-entry box waiting for a message that is
  // never coming.
  try {
    await requestOtp(parsed.data.phone);
  } catch (err) {
    console.error("Failed to send login code:", err);
    return Response.json(
      { message: "We couldn't send your code right now. Please try again shortly." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
