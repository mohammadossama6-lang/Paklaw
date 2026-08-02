import "server-only";
import { randomInt } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { sendOtpViaWhatsApp } from "@/lib/whatsapp";
import { Role } from "@/lib/generated/prisma/enums";
import type { User } from "@/lib/generated/prisma/client";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;

/**
 * Uses the CSPRNG, not Math.random(): this code is the only thing standing
 * between a phone number and a logged-in session, and Math.random()'s output
 * is predictable from previous values.
 */
function generateCode(): string {
  const max = 10 ** OTP_LENGTH;
  return randomInt(0, max).toString().padStart(OTP_LENGTH, "0");
}

export async function requestOtp(phone: string): Promise<void> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  // Retire any code still outstanding for this phone before issuing a new one.
  // Without this, every re-send leaves another guessable code live, so N
  // requests turn a 1-in-a-million guess into N-in-a-million.
  await prisma.otpCode.updateMany({
    where: { phone, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  await prisma.otpCode.create({ data: { phone, code, expiresAt } });
  await sendOtpViaWhatsApp(phone, code);
}

/**
 * Verifies a code and returns the User for that phone, creating one (and
 * linking any existing Lead/LawyerApplication rows with the same phone) on
 * first login.
 *
 * Only a phone matching an *approved* lawyer application becomes a LAWYER
 * account — the application form is a public endpoint, so submitting it must
 * not by itself grant access to client cases. Everyone else is a CLIENT.
 */
export async function verifyOtp(phone: string, code: string): Promise<User | null> {
  const otp = await prisma.otpCode.findFirst({
    where: { phone, code, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return null;

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) return existing;

  const lawyerApplication = await prisma.lawyerApplication.findFirst({
    where: { phone, approved: true },
  });
  const role = lawyerApplication ? Role.LAWYER : Role.CLIENT;

  const user = await prisma.user.create({ data: { phone, role } });

  if (lawyerApplication) {
    await prisma.lawyerApplication.update({
      where: { id: lawyerApplication.id },
      data: { userId: user.id },
    });
  } else {
    await prisma.lead.updateMany({ where: { phone }, data: { clientUserId: user.id } });
  }

  return user;
}
