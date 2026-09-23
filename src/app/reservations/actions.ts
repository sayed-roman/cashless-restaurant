"use server";
import { revalidatePath } from "next/cache";
import {
  bookReservation,
  setReservationStatus,
} from "@/server/reservations/service";
function refreshReservations() {
  revalidatePath("/reservations");
  revalidatePath("/admin", "layout");
}
export async function createReservation(form: FormData) {
  const result = await bookReservation(form);
  if (result.id) refreshReservations();
  return result;
}
export async function updateReservationStatus(form: FormData) {
  const result = await setReservationStatus(form);
  if (result.success) refreshReservations();
  return result;
}
