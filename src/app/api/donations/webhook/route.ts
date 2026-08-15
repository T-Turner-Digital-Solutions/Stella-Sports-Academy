import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { sendAdminNotification, sendConfirmationEmail, escapeHtml } from "@/lib/email";
import { formatCurrency } from "@/lib/utils";

/**
 * Stripe webhook endpoint. Configure this URL (…/api/donations/webhook) in
 * the Stripe Dashboard and set STRIPE_WEBHOOK_SECRET once donations go live.
 *
 * Phase 1 scope: sends donor/admin email notifications on successful
 * checkout. Persisting donations, recurring-donor records, and receipts to a
 * database is Phase 2 (see README).
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
    const donorName = (session.metadata?.donorName as string) || "A Stellar supporter";
    const designation = (session.metadata?.designation as string) || "General Fund";

    await sendAdminNotification(
      "New Stellar donation received",
      `<p><strong>${escapeHtml(donorName)}</strong> gave ${formatCurrency(amount)} to ${escapeHtml(designation)}.</p>`
    );

    if (email) {
      await sendConfirmationEmail(
        email,
        "Thank you for your donation to Stellar Sports Academy",
        `<p>Thank you for your gift of ${formatCurrency(amount)} to Stellar Sports Academy.</p>
         <p>Reference: ${escapeHtml(session.id)}</p>`
      );
    }
  }

  return NextResponse.json({ received: true });
}
