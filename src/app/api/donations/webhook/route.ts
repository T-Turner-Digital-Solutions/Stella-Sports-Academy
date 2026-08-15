import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { sendAdminNotification, sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { formatCurrency, formatDate } from "@/lib/utils";
import { designationLabels, type CampaignDesignation } from "@/content/campaigns";
import { site } from "@/content/site";
import { insertDonation, markDonationReceiptSent, type DonationFrequency } from "@/lib/donations";
import { generateDonationReceiptPdf } from "@/lib/receipt";

/**
 * Stripe webhook endpoint. Configure this URL (…/api/donations/webhook) in
 * the Stripe Dashboard and set STRIPE_WEBHOOK_SECRET once donations go live.
 *
 * On checkout.session.completed: persists the gift to the donations table
 * (admin-only — see /admin/donations, never shown publicly) and emails the
 * donor a proper tax receipt including the organization's EIN.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ message: "Stripe webhook not configured." }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!signature) {
    return NextResponse.json({ message: "Missing signature." }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe:webhook-signature-failed]", error);
    return NextResponse.json({ message: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const amount = session.amount_total ?? 0;
    const email = session.customer_details?.email ?? session.customer_email ?? "";
    const anonymous = session.metadata?.anonymous === "true";
    const donorName = (session.metadata?.donorName as string) || "A Stellar supporter";
    const designationKey = (session.metadata?.designation as string) || "general";
    const designationLabel = designationLabels[designationKey as CampaignDesignation] ?? designationKey;
    const frequency: DonationFrequency = session.mode === "subscription" ? "monthly" : "one-time";
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;

    let donationId: string | null | undefined;
    try {
      donationId = await insertDonation({
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        donorName,
        donorEmail: email || null,
        amountCents: amount,
        currency: session.currency || "usd",
        frequency,
        designation: designationLabel,
        anonymous,
      });
    } catch (error) {
      console.error("[db:insert-donation-failed]", error);
    }

    await sendAdminNotification(
      "New Stellar donation received",
      `<p><strong>${escapeHtml(donorName)}</strong> gave ${formatCurrency(amount)} to ${escapeHtml(designationLabel)}.</p>`
    );

    if (email) {
      const receiptDate = formatDate(new Date().toISOString());
      const receiptNumber = (donationId || session.id).replace(/-/g, "").slice(0, 8).toUpperCase();

      let attachments: { filename: string; content: Buffer }[] | undefined;
      try {
        const pdfBytes = await generateDonationReceiptPdf({
          receiptNumber,
          donationDate: receiptDate,
          donorName,
          donorEmail: email,
          amountLabel: formatCurrency(amount),
          designation: designationLabel,
          paymentMethod: "Card",
          transactionId: session.id,
        });
        attachments = [
          { filename: `Stellar-Sports-Academy-Receipt-${receiptNumber}.pdf`, content: Buffer.from(pdfBytes) },
        ];
      } catch (error) {
        console.error("[receipt:generate-failed]", error);
      }

      const result = await sendConfirmationEmail(
        email,
        "Thank you for your generous support",
        `<p>Dear ${escapeHtml(donorName)},</p>
         <p>On behalf of Stellar Sports Academy, Inc., thank you for your generous contribution of
         ${formatCurrency(amount)}${frequency === "monthly" ? " as a recurring monthly gift" : ""}.</p>
         <p>Your support helps us continue our mission of empowering young athletes through athletic
         development, educational support, mentorship, leadership development, and life-skills
         programs that prepare young people for success on the field, in the classroom, and in life.</p>
         <p>Every contribution helps Stellar Sports Academy create opportunities for young athletes
         and provide the resources, guidance, and support they need to reach their full potential.</p>
         <p><strong>Donation Receipt #:</strong> ${escapeHtml(receiptNumber)}<br/>
         <strong>Donation Date:</strong> ${receiptDate}<br/>
         <strong>Donation Amount:</strong> ${formatCurrency(amount)}<br/>
         <strong>Donation Designation:</strong> ${escapeHtml(designationLabel)}</p>
         <p>Your official tax receipt is attached as a PDF — please retain it with your tax records.
         Stellar Sports Academy, Inc. is recognized as a tax-exempt organization under Section
         501(c)(3) of the Internal Revenue Code. Federal EIN: ${site.ein}. No goods or services were
         provided in exchange for this contribution.</p>
         <p>Thank you for believing in our athletes, our mission, and the future we are building
         together.</p>
         <p>With sincere appreciation,<br/>Stellar Sports Academy, Inc.<br/>
         <em>Empowering Young Athletes. Building Champions for Life.</em></p>`,
        attachments
      );

      if (result.delivered) {
        try {
          await markDonationReceiptSent(session.id);
        } catch (error) {
          console.error("[db:mark-receipt-sent-failed]", error);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
