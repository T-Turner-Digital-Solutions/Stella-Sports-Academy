import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sendAdminNotification, sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { firstFieldErrors } from "@/lib/forms-server";
import { insertContactSubmission } from "@/lib/submissions";
import { verifyCaptcha } from "@/lib/captcha";
import { getClientIp, isContactRateLimited } from "@/lib/rate-limit";
import { classifyContactSubmission } from "@/lib/spam-filter";

const GENERIC_SUCCESS = { message: "Thanks for reaching out — we'll be in touch soon." };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form and try again.", fieldErrors: firstFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);

  if (await isContactRateLimited(ip)) {
    return NextResponse.json(
      { message: "You've submitted several messages recently. Please wait a bit before sending another." },
      { status: 429 }
    );
  }

  // The honeypot stays silent-success on a filled value, same as before —
  // never persisted, never counted against the spam classifier below.
  if (parsed.data.website) {
    return NextResponse.json(GENERIC_SUCCESS);
  }

  const captchaOk = await verifyCaptcha(parsed.data.captchaToken);
  if (!captchaOk) {
    return NextResponse.json(
      { message: "Captcha verification failed. Please try again.", fieldErrors: { captchaToken: "Please complete the captcha." } },
      { status: 400 }
    );
  }

  const c = parsed.data;
  const classification = classifyContactSubmission(c.message);

  try {
    await insertContactSubmission({
      name: c.name,
      email: c.email,
      phone: c.phone,
      inquiryType: c.inquiryType,
      message: c.message,
      ipAddress: ip,
      spamStatus: classification.isSpam ? "quarantined" : "clean",
      spamReason: classification.reason,
    });
  } catch (error) {
    console.error("[db:insert-contact-submission-failed]", error);
  }

  // Quarantined submissions are stored (never deleted) but never notify —
  // an owner reviews them separately at /admin/contact/quarantine. The
  // visitor sees the same generic success message either way, so a
  // spammer gets no signal their message was caught.
  if (!classification.isSpam) {
    await sendAdminNotification(
      `New contact form: ${c.inquiryType}`,
      `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(c.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(c.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(c.phone || "N/A")}</p>
        <p><strong>Inquiry Type:</strong> ${escapeHtml(c.inquiryType)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(c.message).replace(/\n/g, "<br />")}</p>
      `
    );

    await sendConfirmationEmail(
      c.email,
      "We received your message — Stellar Sports Academy",
      `<p>Hi ${escapeHtml(c.name)},</p><p>Thanks for reaching out to Stellar Sports Academy. Our team will respond soon.</p>`
    );
  }

  return NextResponse.json(GENERIC_SUCCESS);
}
