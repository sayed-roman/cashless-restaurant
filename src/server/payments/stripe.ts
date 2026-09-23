import "server-only";
import { verifySignature } from "@/lib/payment-verification";

function secret() { const value = process.env.STRIPE_SECRET_KEY; if (!value) throw new Error("Stripe is not configured."); return value; }
export async function createStripeCheckoutSession(input: { orderId: string; totalMinor: number; customerEmail: string }) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const body = new URLSearchParams({ mode: "payment", success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${origin}/checkout/cancel`, customer_email: input.customerEmail, "line_items[0][price_data][currency]": "bdt", "line_items[0][price_data][product_data][name]": "Cashless Restaurant order", "line_items[0][price_data][unit_amount]": String(input.totalMinor), "line_items[0][quantity]": "1", "metadata[orderId]": input.orderId });
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${secret()}`, "Content-Type": "application/x-www-form-urlencoded", "Idempotency-Key": `checkout-${input.orderId}` }, body });
  const data = await response.json() as { id?: string; url?: string; error?: { message?: string } };
  if (!response.ok || !data.id || !data.url) throw new Error(data.error?.message ?? "Unable to start payment.");
  return { id: data.id, url: data.url };
}
export function verifyStripeSignature(payload: string, signature: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Stripe webhook is not configured.");
  verifySignature(payload, signature, secret);
}

export async function retrieveCheckoutSession(id: string) {
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${secret()}` }, cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve payment session.");
  return await response.json() as { id: string; status: string; url: string | null };
}
