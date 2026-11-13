import { NextResponse } from "next/server";
import { donationCheckoutSchema } from "@/lib/validation";
import { firstFieldErrors } from "@/lib/forms-server";
import { getStripe } from "@/lib/stripe";
import { designationLabels, type CampaignDesignation } from "@/content/campaigns";
import { site } from "@/content/site";

export async function POST(request: Request) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      {
        message:
          "Online giving isn't connected yet — Stripe hasn't been configured for this site. Please contact us to give another way.",
      },
      { status: 501 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = donationCheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the donation form and try again.", fieldErrors: firstFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const { amountCents, frequency, designation, donorName, donorEmail, anonymous, dedication } =
    parsed.data;

  const designationLabel =
    designationLabels[designation as CampaignDesignation] ?? designation;

  const origin = request.headers.get("origin") || site.url;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: frequency === "monthly" ? "subscription" : "payment",
      payment_method_types: ["card"],
      customer_email: donorEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `Stellar Sports Academy Donation — ${designationLabel}`,
            },
            ...(frequency === "monthly" ? { recurring: { interval: "month" as const } } : {}),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate`,
      metadata: {
        designation,
        // Always the real name, even when `anonymous` is set — that flag
        // means "don't list me publicly," not "don't put my name on my own
        // tax receipt." Donor-level detail is admin-only anyway (see
        // /admin/donations), so there's no public surface to protect here.
        donorName,
        anonymous: String(anonymous),
        dedication: dedication || "",
      },
    });

    if (!session.url) {
      return NextResponse.json({ message: "Could not start checkout. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe:checkout-failed]", error);
    return NextResponse.json({ message: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
