import "server-only";

/**
 * Sends portal login codes over WhatsApp via Meta's Cloud API.
 *
 * Business-initiated messages must use an approved template, so this posts a
 * template message rather than free-form text. Set up in Meta Business Manager:
 * an *Authentication* category template whose body takes one variable (the
 * code) and whose button is a one-tap/copy-code button — Meta requires the
 * code to be passed to BOTH the body and the button component, which is why it
 * appears twice in the payload below.
 *
 * Required environment variables:
 *   WHATSAPP_PHONE_NUMBER_ID  the sender's phone number ID from Meta
 *   WHATSAPP_ACCESS_TOKEN     a permanent System User access token
 *   WHATSAPP_OTP_TEMPLATE     template name (defaults to "otp_login")
 *   WHATSAPP_TEMPLATE_LOCALE  template language tag (defaults to "en")
 */

const GRAPH_VERSION = process.env.WHATSAPP_API_VERSION ?? "v21.0";

class WhatsAppNotConfiguredError extends Error {
  constructor() {
    super(
      "WhatsApp is not configured — set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN."
    );
    this.name = "WhatsAppNotConfiguredError";
  }
}

/** Meta expects the recipient in E.164 without the leading "+". */
function toWhatsAppRecipient(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function sendOtpViaWhatsApp(phone: string, code: string): Promise<void> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    // In development, log the code so the flow stays testable without Meta
    // credentials. In production, fail loudly: silently "succeeding" here is
    // what made login look functional while no message was ever sent.
    if (process.env.NODE_ENV === "production") throw new WhatsAppNotConfiguredError();
    console.warn(`[whatsapp:unconfigured] OTP for ${phone}: ${code}`);
    return;
  }

  const template = process.env.WHATSAPP_OTP_TEMPLATE ?? "otp_login";
  const locale = process.env.WHATSAPP_TEMPLATE_LOCALE ?? "en";

  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toWhatsAppRecipient(phone),
        type: "template",
        template: {
          name: template,
          language: { code: locale },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: code }],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [{ type: "text", text: code }],
            },
          ],
        },
      }),
    }
  );

  if (!response.ok) {
    // Meta puts the useful detail in the body; the status alone says little.
    const detail = await response.text().catch(() => "");
    throw new Error(
      `WhatsApp send failed (${response.status}): ${detail.slice(0, 500)}`
    );
  }
}
