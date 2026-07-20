import "server-only";

import { prisma } from "@/lib/prisma";
import { sendOtpViaWhatsApp } from "@/lib/whatsapp";
import { Role } from "@/lib/generated/prisma/enums";
import type { User } from "@/lib/generated/prisma/client";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;

function generateCode(): string {
  const max = 10 ** OTP_LENGTH;
  return Math.floor(Math.random() * max)
    .toString()
    .padStart(OTP_LENGTH, "0");
}

export async function requestOtp(phone: string): Promise<void> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.otpCode.create({ data: { phone, code, expiresAt } });
  await sendOtpViaWhatsApp(phone, code);
}

/**
 * Verifies a code and returns the User for that phone, creating one (and
 * linking any existing Lead/LawyerApplication rows with the same phone) on
 * first login. A phone that matches an approved lawyer application becomes a
 * LAWYER account; everyone else is a CLIENT.
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

  const lawyerApplication = await prisma.lawyerApplication.findFirst({ where: { phone } });
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
