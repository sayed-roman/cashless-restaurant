import "server-only";
import { cache } from "react";
import type { Food, FoodCategory } from "@prisma/client";
import type { Category, Dish } from "@/data/menu";
import { db } from "@/server/db/client";
const categories: Record<FoodCategory, Category> = {
  STARTERS: "Starters",
  MAIN_COURSE: "Main Course",
  DESSERTS: "Desserts",
  DRINKS: "Drinks",
};
function toDish(food: Food): Dish {
  return {
    slug: food.slug,
    name: food.name,
    category: categories[food.category],
    price: food.priceMinor / 100,
    image: food.image,
    description: food.description,
    ingredients: food.ingredients,
    portion: food.portion,
    allergens: food.allergens,
  };
}
export async function getMenu(): Promise<Dish[]> {
  const foods = await db.food.findMany({
    where: { available: true, currency: "bdt" },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
  });
  return foods.map(toDish);
}
export const getDish = cache(async (slug: string): Promise<Dish | null> => {
  const food = await db.food.findFirst({
    where: { slug, available: true, currency: "bdt" },
  });
  return food ? toDish(food) : null;
});
