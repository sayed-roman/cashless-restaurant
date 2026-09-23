import { NextResponse } from "next/server";
import { verifyStripeSignature } from "@/server/payments/stripe";
import { processPaymentEvent } from "@/server/payments/webhook";
import type { PaymentSession } from "@/lib/payment-verification";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
  const payload = await request.text();
  let event: { type: string; data: { object: PaymentSession } };
  try {
    verifyStripeSignature(payload, request.headers.get("stripe-signature") ?? "");
    event = JSON.parse(payload);
    if (typeof event?.type !== "string" || !event.data?.object) throw new Error("Invalid event");
  } catch {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
  try {
    await processPaymentEvent(event.type, event.data.object);
    return NextResponse.json({ received: true });
  } catch {
    console.error("Payment webhook processing failed; delivery should be retried.");
    return NextResponse.json({ error: "Unable to process payment" }, { status: 500 });
  }
}
