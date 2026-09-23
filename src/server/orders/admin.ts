import "server-only";
import { db } from "@/server/db/client";
import { requireAdmin } from "@/server/auth/session";
import { canTransitionOrder, isOrderState } from "@/lib/order-status";

export async function listAdminOrders(page: number, status?: string) {
  await requireAdmin();
  const currentPage = Number.isSafeInteger(page) && page > 0 && page <= 10000 ? page : 1;
  const filter = isOrderState(status) ? status : undefined;
  const rows = await db.order.findMany({
    where: filter ? { status: filter } : {},
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * 20, take: 21,
    select: {
      id: true, customerName: true, phone: true, notes: true, status: true,
      createdAt: true, totalMinor: true, currency: true, paymentStatus: true, stripeCheckoutSessionId: true,
      user: { select: { email: true } },
      items: { select: { id: true, nameSnapshot: true, priceMinor: true, quantity: true } },
    },
  });
  return { orders: rows.slice(0, 20), hasMore: rows.length > 20, page: currentPage, filter };
}

export async function changeOrderStatus(form: FormData) {
  // Each mutation rechecks the current database role, independently of the page.
  await requireAdmin();
  const id = form.get("id");
  const from = form.get("from");
  const to = form.get("status");
  if (typeof id !== "string" || !id || id.length > 100 || !isOrderState(from) || !isOrderState(to) || !canTransitionOrder(from, to))
    return { error: "Choose a valid next order status." };
  try {
    // Compare-and-set prevents a stale tab from overwriting another admin's update.
    const result = await db.order.updateMany({ where: { id, status: from }, data: { status: to } });
    if (result.count !== 1) return { error: "This order changed or no longer exists. Refresh before trying again." };
    return { success: true };
  } catch {
    return { error: "Unable to update the order right now. Please try again." };
  }
}
