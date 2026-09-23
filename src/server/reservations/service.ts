import "server-only";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";
import { getAuth } from "@/server/auth/auth";
import { requireAdmin, requireUser } from "@/server/auth/session";
import {
  parseReservation,
  canChangeReservation,
  reservationStatuses,
  type ReservationState,
} from "@/lib/reservation-rules";

export async function bookReservation(form: FormData) {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session)
    return { error: "Please log in to book a table.", loginRequired: true };
  let data;
  try {
    data = parseReservation(form);
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Check your booking details.",
    };
  }
  try {
    const booking = await db.reservation.create({
      data: { ...data, userId: session.user.id },
    });
    return { id: booking.id };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error:
          "You already have a reservation for this time. Check My Reservations or choose another time.",
      };
    }
    return {
      error:
        "Unable to save your booking. Check My Reservations before retrying.",
    };
  }
}
export async function myReservations(page = 1) {
  const user = await requireUser("/reservations");
  const where = { userId: user.id };
  const [rows, total] = await Promise.all([
    db.reservation.findMany({
      where,
      orderBy: { scheduledAt: "desc" },
      skip: (page - 1) * 20,
      take: 20,
    }),
    db.reservation.count({ where }),
  ]);
  return { rows, total };
}
export async function adminReservations(page = 1) {
  await requireAdmin();
  const [rows, total] = await Promise.all([
    db.reservation.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 20,
      take: 20,
      include: { user: { select: { email: true } } },
    }),
    db.reservation.count(),
  ]);
  return { rows, total };
}
export async function reservationSummary() {
  await requireAdmin();
  const [total, pending] = await Promise.all([
    db.reservation.count(),
    db.reservation.count({ where: { status: "PENDING" } }),
  ]);
  return { total, pending };
}
export async function setReservationStatus(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "") as ReservationState;
  if (!id || id.length > 100 || !reservationStatuses.includes(status))
    return { error: "Invalid reservation update." };
  try {
    const booking = await db.reservation.findUnique({ where: { id } });
    if (!booking) return { error: "Reservation not found." };
    if (!canChangeReservation(booking.status, status, booking.scheduledAt))
      return {
        error: "This status change is not available. Refresh the list.",
      };
    const result = await db.reservation.updateMany({
      where: { id, status: booking.status },
      data: { status },
    });
    if (!result.count)
      return {
        error: "The booking changed in another session. Refresh and try again.",
      };
    return { success: true };
  } catch {
    return { error: "Unable to update the reservation. Please try again." };
  }
}
