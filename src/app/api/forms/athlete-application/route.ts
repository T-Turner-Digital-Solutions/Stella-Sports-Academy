import { NextResponse } from "next/server";
import { athleteApplicationSchema } from "@/lib/validation";
import { sendAdminNotification, sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { firstFieldErrors } from "@/lib/forms-server";
import { insertAthleteApplication } from "@/lib/submissions";

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

  // Persisted to the private admin review database (see /admin/applications)
  // in addition to the email relay below. Never written anywhere public —
  // athlete data (including date of birth) never appears in any
  // client-visible response or on any public page.
  try {
    await insertAthleteApplication({
      athleteFirstName: a.athleteFirstName,
      athleteLastName: a.athleteLastName,
      dateOfBirth: a.dateOfBirth,
      school: a.school,
      grade: a.grade,
      sport: a.sport,
      position: a.position,
      currentTeam: a.currentTeam,
      parentName: a.parentName,
      parentEmail: a.parentEmail,
      parentPhone: a.parentPhone,
      programInterest: a.programInterest,
      financialAssistance: a.financialAssistance === "yes",
      additionalInfo: a.additionalInfo,
    });
  } catch (error) {
    console.error("[db:insert-athlete-application-failed]", error);
  }

  await sendAdminNotification(
    "New Steller Athlete Application",
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
    "We received your Steller Sports Academy application",
    `<p>Hi ${escapeHtml(a.parentName)},</p>
     <p>Thank you for applying to Steller Sports Academy on behalf of ${escapeHtml(a.athleteFirstName)}. Our team will review the application and follow up by email or phone.</p>
     <p>— Steller Sports Academy</p>`
  );

  return NextResponse.json({
    message:
      "Application received. Our team will review it and follow up with you by email or phone.",
  });
}
