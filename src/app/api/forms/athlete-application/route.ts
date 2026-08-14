import { NextResponse } from "next/server";
import { athleteApplicationSchema } from "@/lib/validation";
import { sendAdminNotification, sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { firstFieldErrors } from "@/lib/forms-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = athleteApplicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form and try again.", fieldErrors: firstFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ message: "Application received." });
  }

  const a = parsed.data;

  // NOTE: Phase 1 has no database or admin portal yet, so this application is
  // relayed only via private email to the organization's admin inbox — never
  // written anywhere public. Athlete data (including date of birth) never
  // appears in any client-visible response or on any public page.
  await sendAdminNotification(
    "New Stella Athlete Application",
    `
      <h2>New Athlete Application</h2>
      <p><strong>Athlete:</strong> ${escapeHtml(a.athleteFirstName)} ${escapeHtml(a.athleteLastName)}</p>
      <p><strong>Date of Birth:</strong> ${escapeHtml(a.dateOfBirth)}</p>
      <p><strong>School / Grade:</strong> ${escapeHtml(a.school)} / ${escapeHtml(a.grade)}</p>
      <p><strong>Sport / Position:</strong> ${escapeHtml(a.sport)} ${a.position ? "/ " + escapeHtml(a.position) : ""}</p>
      <p><strong>Current Team:</strong> ${escapeHtml(a.currentTeam || "N/A")}</p>
      <hr />
      <p><strong>Parent/Guardian:</strong> ${escapeHtml(a.parentName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(a.parentEmail)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(a.parentPhone)}</p>
      <hr />
      <p><strong>Program Interest:</strong> ${a.programInterest.map(escapeHtml).join(", ")}</p>
      <p><strong>Financial Assistance Requested:</strong> ${a.financialAssistance === "yes" ? "Yes" : "No"}</p>
      <p><strong>Additional Info:</strong> ${escapeHtml(a.additionalInfo || "N/A")}</p>
    `
  );

  await sendConfirmationEmail(
    a.parentEmail,
    "We received your Stella Sports Academy application",
    `<p>Hi ${escapeHtml(a.parentName)},</p>
     <p>Thank you for applying to Stella Sports Academy on behalf of ${escapeHtml(a.athleteFirstName)}. Our team will review the application and follow up by email or phone.</p>
     <p>— Stella Sports Academy</p>`
  );

  return NextResponse.json({
    message:
      "Application received. Our team will review it and follow up with you by email or phone.",
  });
}
