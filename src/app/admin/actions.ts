"use server";
import { revalidatePath } from "next/cache";
import { mutateFood } from "@/server/admin/foods";
export async function changeFood(form: FormData) {
  const result = await mutateFood(form);
  if (result.success) {
    revalidatePath("/admin");
    revalidatePath("/menu", "layout");
    revalidatePath("/");
  }
  return result;
}
