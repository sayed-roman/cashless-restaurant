import { PaidCart } from "@/components/orders/paid-cart";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/session";
import { db } from "@/server/db/client";
export default async function PaymentResult({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const user = await requireUser("/account/orders");
  const { session_id: sessionId } = await searchParams;
  if (!sessionId || sessionId.length > 255) notFound();
  const order = await db.order.findFirst({ where: { stripeCheckoutSessionId: sessionId, userId: user.id } });
  if (!order) notFound();
  const paid = order.paymentStatus === "PAID";
  return <main className="section wrap center">
    {paid && <PaidCart orderId={order.id} />}
    <p className="eyebrow">{paid ? "Payment confirmed" : "Payment confirmation pending"}</p>
    <h1 className="section-title">{paid ? "Thank you for your order." : "We are checking your payment."}</h1>
    <p>Reference: {order.id}</p>
    <p>{paid ? "Your payment is confirmed. Follow preparation progress in My Orders." : "Confirmation can take a moment. Refresh this page shortly; do not pay again."}</p>
    <Link className="button" href="/account/orders">View My Orders</Link>
  </main>;
}
