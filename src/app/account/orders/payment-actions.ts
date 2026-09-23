"use server";
import { redirect } from "next/navigation";
import { requireUser } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { retrieveCheckoutSession } from "@/server/payments/stripe";
export async function resumePayment(form: FormData) {
  const user = await requireUser("/account/orders");
  const id = form.get("orderId");
  if (typeof id !== "string" || id.length > 100) return;
  const order = await db.order.findFirst({ where: { id, userId: user.id } });
  if (!order || order.status === "CANCELLED" || order.paymentStatus === "PAID" || order.paymentStatus === "REFUNDED" || !order.stripeCheckoutSessionId) return;
  let url: string | null = null;
  try {
    const session = await retrieveCheckoutSession(order.stripeCheckoutSessionId);
    if (session.status === "open" && session.url && new URL(session.url).hostname === "checkout.stripe.com") url = session.url;
  } catch {
    redirect("/account/orders?payment=unavailable");
  }
  if (url) redirect(url);
  redirect("/account/orders?payment=closed");
}
