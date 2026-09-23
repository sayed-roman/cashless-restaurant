"use server";
import { revalidatePath } from "next/cache";
import { changeOrderStatus } from "@/server/orders/admin";
export async function updateOrderStatus(form: FormData) {
  const result = await changeOrderStatus(form);
  if (result.success) {
    revalidatePath("/admin/orders");
    revalidatePath("/account/orders");
  }
  return result;
}
