import { NextResponse } from "next/server";
import { corporateSponsorshipSchema } from "@/lib/validation";
import { sendAdminNotification, sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { firstFieldErrors } from "@/lib/forms-server";
import { insertSponsorshipInquiry } from "@/lib/submissions";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = corporateSponsorshipSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form and try again.", fieldErrors: firstFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ message: "Thank you for your interest in sponsoring Stella." });
  }

  const s = parsed.data;

  try {
    await insertSponsorshipInquiry({
      companyName: s.companyName,
      contactName: s.contactName,
      email: s.email,
      phone: s.phone,
      interestedTier: s.interestedTier,
      message: s.message,
    });
  } catch (error) {
    console.error("[db:insert-sponsorship-inquiry-failed]", error);
  }

  await sendAdminNotification(
    "New corporate sponsorship inquiry",
    `
      <h2>New Corporate Sponsorship Inquiry</h2>
      <p><strong>Company:</strong> ${escapeHtml(s.companyName)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(s.contactName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(s.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(s.phone || "N/A")}</p>
      <p><strong>Interested Tier:</strong> ${escapeHtml(s.interestedTier || "N/A")}</p>
      <p><strong>Message:</strong> ${escapeHtml(s.message || "N/A")}</p>
    `
  );

  await sendConfirmationEmail(
    s.email,
    "We received your Stella sponsorship inquiry",
    `<p>Hi ${escapeHtml(s.contactName)},</p><p>Thank you for your interest in becoming a Stella Sports Academy sponsor. Our team will follow up soon.</p>`
  );

  return NextResponse.json({ message: "Thank you! Your sponsorship inquiry has been received." });
}
