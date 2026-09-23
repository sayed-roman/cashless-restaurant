import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";
import { requireAdmin } from "@/server/auth/session";
import { parseFood } from "@/lib/food-validation";

export async function listAdminFoods() {
  await requireAdmin();
  return db.food.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      priceMinor: true,
      image: true,
      description: true,
      portion: true,
      ingredients: true,
      allergens: true,
      available: true,
      sortOrder: true,
    },
  });
}
export type AdminFood = Awaited<ReturnType<typeof listAdminFoods>>[number];
export async function mutateFood(form: FormData) {
  await requireAdmin();
  const operation = form.get("operation");
  const id = form.get("id");
  if (!["create", "update", "delete"].includes(String(operation)))
    return { error: "Invalid action." };
  if (
    operation !== "create" &&
    (typeof id !== "string" || !id || id.length > 100)
  )
    return { error: "Invalid food." };
  let input;
  if (operation !== "delete") {
    try {
      input = parseFood(form);
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Please check the food details.",
      };
    }
  }
  try {
    if (operation === "delete")
      await db.food.delete({ where: { id: id as string } });
    else if (operation === "update")
      await db.food.update({ where: { id: id as string }, data: input! });
    else await db.food.create({ data: { ...input!, currency: "bdt" } });
    return {
      success: operation === "delete" ? "Food deleted." : "Food saved.",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002")
        return { error: "That URL slug already exists. Choose another." };
      if (error.code === "P2025")
        return { error: "This food no longer exists. Refresh the page." };
      if (error.code === "P2003")
        return {
          error:
            "This food is linked to other records. Mark it unavailable instead.",
        };
    }
    return { error: "Unable to save changes. Please try again." };
  }
}
