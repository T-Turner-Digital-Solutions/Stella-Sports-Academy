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
          monthly: frequency === "monthly",
        });
        attachments = [
          { filename: `Stellar-Sports-Academy-Receipt-${receiptNumber}.pdf`, content: Buffer.from(pdfBytes) },
        ];
      } catch (error) {
        console.error("[receipt:generate-failed]", error);
      }

      const result = await sendConfirmationEmail(
        email,
        `Thank you for your donation to ${site.name}`,
        `<p>Dear ${escapeHtml(donorName)},</p>
         <p>Thank you for your generous gift of ${formatCurrency(amount)} to ${escapeHtml(site.name)}${
           frequency === "monthly" ? " as a recurring monthly gift" : ""
         }, designated to ${escapeHtml(designationLabel)}.</p>
         <p>Your official donation receipt is attached as a PDF — please keep it for your tax records.</p>
         <p><strong>Donation Summary</strong><br/>
         Date: ${receiptDate}<br/>
         Amount: ${formatCurrency(amount)}<br/>
         Designation: ${escapeHtml(designationLabel)}<br/>
         Reference: ${escapeHtml(session.id)}</p>
         <p>${escapeHtml(site.name)} is a ${escapeHtml(site.orgType)}. Federal Tax ID (EIN): ${site.ein}.
         No goods or services were provided in exchange for this contribution.</p>
         <p>With gratitude,<br/>${escapeHtml(site.name)}</p>`,
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
