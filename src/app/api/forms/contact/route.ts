import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sendAdminNotification, sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { firstFieldErrors } from "@/lib/forms-server";
import { insertContactSubmission } from "@/lib/submissions";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form and try again.", fieldErrors: firstFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ message: "Thanks for reaching out — we'll be in touch soon." });
  }

  const c = parsed.data;

  try {
    await insertContactSubmission({
      name: c.name,
      email: c.email,
      phone: c.phone,
      inquiryType: c.inquiryType,
      message: c.message,
    });
  } catch (error) {
    console.error("[db:insert-contact-submission-failed]", error);
  }

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
    "We received your message — Stella Sports Academy",
    `<p>Hi ${escapeHtml(c.name)},</p><p>Thanks for reaching out to Stella Sports Academy. Our team will respond soon.</p>`
  );

  return NextResponse.json({ message: "Thanks for reaching out — we'll be in touch soon." });
}
