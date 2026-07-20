// Sends portal login codes over WhatsApp. Wire this up to the Meta
// Conversation API (via GHL's connected WhatsApp channel, or the Cloud API
// directly) once that connection is live — for now it just logs, so the OTP
// flow can be built and tested end-to-end ahead of that.
export async function sendOtpViaWhatsApp(phone: string, code: string): Promise<void> {
  console.log(`[whatsapp:stub] OTP for ${phone}: ${code}`);
}
