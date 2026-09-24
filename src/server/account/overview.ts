import "server-only";
import { db } from "@/server/db/client";

export async function accountOverview(userId: string) {
  const upcoming = { userId, status: { in: ["PENDING", "CONFIRMED"] as ("PENDING" | "CONFIRMED")[] }, scheduledAt: { gte: new Date() } };
  const [activeOrders, upcomingReservations, pastOrders, recentOrder, reservation] = await Promise.all([
    db.order.count({ where: { userId, status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] } } }),
    db.reservation.count({ where: upcoming }),
    db.order.count({ where: { userId, status: { in: ["COMPLETED", "CANCELLED"] } } }),
    db.order.findFirst({ where: { userId }, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: { id: true, status: true, paymentStatus: true, totalMinor: true, currency: true, createdAt: true,
        items: { select: { nameSnapshot: true, quantity: true, food: { select: { image: true } } } } } }),
    db.reservation.findFirst({ where: upcoming, orderBy: [{ scheduledAt: "asc" }, { id: "asc" }],
      select: { id: true, scheduledAt: true, guests: true, status: true } }),
  ]);
  // Link to the actual history page even when many later bookings exist.
  const laterBookings = reservation ? await db.reservation.count({ where: { userId, scheduledAt: { gt: reservation.scheduledAt } } }) : 0;
  const reservationPage = Math.floor(laterBookings / 20) + 1;
  return { activeOrders, upcomingReservations, pastOrders, recentOrder, reservation, reservationPage };
}
