import "server-only";
import { db } from "@/server/db/client";
import { requireUser } from "@/server/auth/session";

export async function getMyOrders(page = 1) {
  const user = await requireUser("/account/orders");
  const currentPage = Number.isSafeInteger(page) && page > 0 && page <= 10000 ? page : 1;
  const rows = await db.order.findMany({
    // Ownership always comes from the authenticated session.
    where: { userId: user.id },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * 10,
    take: 11,
    select: {
      id: true, createdAt: true, status: true, totalMinor: true, currency: true, paymentStatus: true, stripeCheckoutSessionId: true, notes: true,
      items: { select: { id: true, nameSnapshot: true, quantity: true, priceMinor: true } },
    },
  });
  return { orders: rows.slice(0, 10), hasMore: rows.length > 10, page: currentPage };
}
