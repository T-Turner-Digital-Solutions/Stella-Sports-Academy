import { NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/validation";
import { sendAdminNotification, sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { firstFieldErrors } from "@/lib/forms-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = volunteerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form and try again.", fieldErrors: firstFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ message: "Thank you for volunteering with Stella." });
  }

  const v = parsed.data;

  await sendAdminNotification(
    "New Stella volunteer application",
    `
      <h2>New Volunteer Application</h2>
      <p><strong>Name:</strong> ${escapeHtml(v.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(v.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(v.phone)}</p>
      <p><strong>Area of Interest:</strong> ${escapeHtml(v.areaOfInterest)}</p>
      <p><strong>Availability:</strong> ${escapeHtml(v.availability)}</p>
      <p><strong>Experience:</strong> ${escapeHtml(v.experience || "N/A")}</p>
      <p><strong>Message:</strong> ${escapeHtml(v.message || "N/A")}</p>
    `
  );

  await sendConfirmationEmail(
    v.email,
    "We received your Stella volunteer application",
    `<p>Hi ${escapeHtml(v.name)},</p><p>Thank you for your interest in volunteering with Stella Sports Academy. Our team will follow up soon.</p>`
  );

  return NextResponse.json({ message: "Thank you! Your volunteer application has been received." });
}
