import Stripe from "stripe";

let client: Stripe | null = null;

/** Returns null when STRIPE_SECRET_KEY isn't configured — callers must handle
 * that gracefully rather than pretending payments are live. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
