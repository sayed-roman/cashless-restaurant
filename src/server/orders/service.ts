import "server-only";
import { headers } from "next/headers";
import { db } from "@/server/db/client";
import { getAuth } from "@/server/auth/auth";
import { OrderError, parseOrder, priceOrder } from "@/lib/order-validation";
import { createStripeCheckoutSession } from "@/server/payments/stripe";

export async function createOrder(input: unknown) {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) throw new OrderError("Your session has expired. Please log in again before placing your order.", 401);
  const order = parseOrder(input);
  // A serializable transaction keeps menu reads and order writes consistent.
  const created = await db.$transaction(async (tx) => {
    const foods = await tx.food.findMany({
      where: { slug: { in: order.lines.map((line) => line.slug) }, available: true, currency: "bdt" },
      select: { id: true, slug: true, name: true, priceMinor: true },
    });
    const { items, totalMinor } = priceOrder(order.lines, foods);
    return tx.order.create({
      data: {
        userId: session.user.id,
        customerName: order.name,
        phone: order.phone,
        notes: order.notes,
        totalMinor,
        items: { create: items },
      },
      select: { id: true, totalMinor: true },
    });
  }, { isolationLevel: "Serializable" });
  const stripeSession = await createStripeCheckoutSession({ orderId: created.id, totalMinor: created.totalMinor, customerEmail: session.user.email });
  await db.order.update({ where: { id: created.id }, data: { stripeCheckoutSessionId: stripeSession.id, paymentStatus: "PENDING" } });
  return { id: created.id, totalMinor: created.totalMinor, checkoutUrl: stripeSession.url };
}
