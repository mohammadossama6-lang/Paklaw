import { z } from "zod";

import { verifyOtpSchema } from "@/lib/auth-schema";
import { verifyOtp } from "@/lib/otp";
import { createSession } from "@/lib/session";
import { Role } from "@/lib/generated/prisma/enums";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = verifyOtpSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: "Invalid request.", errors: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    );
  }

  const user = await verifyOtp(parsed.data.phone, parsed.data.code);

  if (!user) {
    return Response.json({ message: "That code is invalid or has expired." }, { status: 400 });
  }

  await createSession({ userId: user.id, role: user.role });

  const redirectTo = user.role === Role.LAWYER ? "/portal/lawyer" : "/portal/client";
  return Response.json({ ok: true, redirectTo });
}
