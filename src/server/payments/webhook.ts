import "server-only";
import { db } from "@/server/db/client";
import { matchesPayment, type PaymentSession } from "@/lib/payment-verification";

export async function processPaymentEvent(type: string, session: PaymentSession) {
  const success = type === "checkout.session.completed" || type === "checkout.session.async_payment_succeeded";
  const failure = type === "checkout.session.async_payment_failed" || type === "checkout.session.expired";
  if (!success && !failure) return;
  if (typeof session?.id !== "string") throw new Error("Missing session id.");
  const order = await db.order.findUnique({ where: { stripeCheckoutSessionId: session.id } });
  // Retry rather than acknowledge a webhook racing the initial session-id write.
  if (!order) throw new Error("Order not found for payment session.");
  if (!matchesPayment(order, session)) throw new Error("Payment does not match order.");
  if (success && session.payment_status !== "paid") return;
  await db.order.updateMany({
    where: { id: order.id, paymentStatus: { in: ["UNPAID", "PENDING", "FAILED"] } },
    data: success ? { paymentStatus: "PAID", paidAt: new Date() } : { paymentStatus: "FAILED" },
  });
}
