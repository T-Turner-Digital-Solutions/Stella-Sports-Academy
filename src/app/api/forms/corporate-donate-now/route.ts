import { NextResponse } from "next/server";
import { corporateSponsorshipSchema } from "@/lib/validation";
import { sendAdminNotification, sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { firstFieldErrors } from "@/lib/forms-server";
import { insertSponsorshipInquiry } from "@/lib/submissions";

// Netlify Functions buffer request bodies at 6 MB, and binary uploads are
// base64-encoded in transit (~33% overhead) — keep a safe margin under that
// effective ~4.5 MB limit rather than let a large upload fail with an
// opaque platform error.
const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];

/** Backs the "Donate Now" popup specifically — unlike the general "Become a
 * Corporate Sponsor" inquiry (/api/forms/corporate-sponsorship), every
 * submission here uploads a company logo and the donor is sent on to Zeffy
 * immediately after. Both land in the same corporate_sponsorship_inquiries
 * table so Natalie sees all of them from the Board Portal. */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  }

  const parsed = corporateSponsorshipSchema.safeParse({
    companyName: form.get("companyName"),
    contactName: form.get("contactName"),
    email: form.get("email"),
    phone: form.get("phone") || undefined,
    interestedTier: form.get("interestedTier") || undefined,
    message: form.get("message") || undefined,
    website: form.get("website") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form and try again.", fieldErrors: firstFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ message: "Thank you for your interest in sponsoring Stellar." });
  }

  const logo = form.get("logo");
  if (!(logo instanceof File) || logo.size === 0) {
    return NextResponse.json(
      { message: "Please upload your company logo.", fieldErrors: { logo: "Company logo is required." } },
      { status: 400 }
    );
  }
  if (!ALLOWED_LOGO_TYPES.includes(logo.type)) {
    return NextResponse.json(
      { message: "Logo must be a PNG, JPG, SVG, or WebP image.", fieldErrors: { logo: "Unsupported file type." } },
      { status: 400 }
    );
  }
  if (logo.size > MAX_LOGO_BYTES) {
    return NextResponse.json(
      {
        message: `That logo is too large (max ${Math.floor(MAX_LOGO_BYTES / (1024 * 1024))} MB).`,
        fieldErrors: { logo: "File is too large." },
      },
      { status: 413 }
    );
  }

  const s = parsed.data;
  const logoBytes = await logo.arrayBuffer();

  try {
    await insertSponsorshipInquiry({
      companyName: s.companyName,
      contactName: s.contactName,
      email: s.email,
      phone: s.phone,
      interestedTier: s.interestedTier,
      message: s.message,
      logoBytes,
      logoFileName: logo.name,
      logoContentType: logo.type,
    });
  } catch (error) {
    console.error("[db:insert-sponsorship-inquiry-failed]", error);
  }

  await sendAdminNotification(
    "New corporate donor — heading to Zeffy",
    `
      <h2>New Corporate Donor (Donate Now)</h2>
      <p><strong>Company:</strong> ${escapeHtml(s.companyName)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(s.contactName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(s.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(s.phone || "N/A")}</p>
      <p><strong>Interested Tier:</strong> ${escapeHtml(s.interestedTier || "N/A")}</p>
      <p><strong>Message:</strong> ${escapeHtml(s.message || "N/A")}</p>
      <p>Logo uploaded: ${escapeHtml(logo.name)}</p>
    `
  );

  await sendConfirmationEmail(
    s.email,
    "We received your Stellar sponsorship details",
    `<p>Hi ${escapeHtml(s.contactName)},</p><p>Thank you — we've received your company details and logo. You're being taken to Zeffy now to complete your donation and receive your donation letter.</p>`
  );

  return NextResponse.json({ message: "Thanks! Taking you to Zeffy to complete your donation." });
}
