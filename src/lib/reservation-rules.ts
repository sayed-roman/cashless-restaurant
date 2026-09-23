import { validPhone } from "./validation";
export const reservationTimes = [
  "12:00",
  "13:00",
  "14:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];
export const reservationStatuses = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
] as const;
export type ReservationState = (typeof reservationStatuses)[number];
export function parseReservation(form: FormData, now = Date.now()) {
  const name = String(form.get("name") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const date = String(form.get("date") ?? "");
  const time = String(form.get("time") ?? "");
  const guestText = String(form.get("guests") ?? "");
  if (name.length < 2 || name.length > 80)
    throw new Error("Enter a name of 2–80 characters.");
  if (!validPhone(phone)) throw new Error("Enter a valid phone number.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !reservationTimes.includes(time))
    throw new Error("Choose a valid date and time.");
  const calendar = new Date(date + "T00:00:00Z");
  if (
    !Number.isFinite(calendar.getTime()) ||
    calendar.toISOString().slice(0, 10) !== date
  )
    throw new Error("Choose a valid calendar date.");
  const scheduledAt = new Date(date + "T" + time + ":00+06:00");
  if (scheduledAt.getTime() <= now)
    throw new Error("Choose a future time in Bangladesh time.");
  if (scheduledAt.getTime() > now + 90 * 86400000)
    throw new Error("Bookings are available up to 90 days ahead.");
  if (!/^[1-8]$/.test(guestText))
    throw new Error("Choose between 1 and 8 guests.");
  return { name, phone, scheduledAt, guests: Number(guestText) };
}
export function canChangeReservation(
  from: ReservationState,
  to: ReservationState,
  scheduledAt: Date,
  now = Date.now(),
) {
  if (from === to) return false;
  if (from === "PENDING")
    return (
      to === "CANCELLED" || (to === "CONFIRMED" && scheduledAt.getTime() > now)
    );
  if (from === "CONFIRMED")
    return (
      to === "CANCELLED" || (to === "COMPLETED" && scheduledAt.getTime() <= now)
    );
  return false;
}
export function reservationDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
