import { Resend } from "resend";

const FROM_ADDRESS = process.env.EMAIL_FROM || "Steller Sports Academy <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL;

let resendClient: Resend | null = null;

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

/**
 * Sends an internal notification email when a public form is submitted.
 * Gracefully no-ops (and logs server-side) if RESEND_API_KEY / ADMIN_NOTIFY_EMAIL
 * aren't configured yet — forms still "succeed" for the visitor, but nothing
 * is silently pretended to be delivered. See README for setup.
 */
export async function sendAdminNotification(subject: string, html: string) {
  const client = getClient();

  if (!client || !ADMIN_EMAIL) {
    console.log(`[email:not-configured] Would send "${subject}" to admin.`);
    return { delivered: false as const };
  }

  try {
    await client.emails.send({
      from: FROM_ADDRESS,
      to: ADMIN_EMAIL,
      subject,
      html,
    });
    return { delivered: true as const };
  } catch (error) {
    console.error("[email:send-failed]", error);
    return { delivered: false as const };
  }
}

export async function sendConfirmationEmail(to: string, subject: string, html: string) {
  const client = getClient();

  if (!client) {
    console.log(`[email:not-configured] Would send confirmation "${subject}" to ${to}.`);
    return { delivered: false as const };
  }

  try {
    await client.emails.send({ from: FROM_ADDRESS, to, subject, html });
    return { delivered: true as const };
  } catch (error) {
    console.error("[email:send-failed]", error);
    return { delivered: false as const };
  }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
