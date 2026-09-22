import { FoodCategory, PrismaClient } from "@prisma/client";
import { dishes, type Category } from "../src/data/menu";

const db = new PrismaClient();
const categories: Record<Category, FoodCategory> = {
  Starters: FoodCategory.STARTERS,
  "Main Course": FoodCategory.MAIN_COURSE,
  Desserts: FoodCategory.DESSERTS,
  Drinks: FoodCategory.DRINKS,
};

async function seed() {
  await db.$transaction(
    dishes.map((dish, sortOrder) => {
      const { price, category, ...details } = dish;
      return db.food.upsert({
        where: { slug: dish.slug },
        // Re-running seed must not overwrite future admin edits.
        update: {},
        create: {
          ...details,
          category: categories[category],
          priceMinor: Math.round(price * 100),
          currency: "bdt",
          sortOrder,
        },
      });
    }),
  );
  console.log("Menu seed complete.");
}

seed()
  .catch(() => {
    console.error("Menu seed failed. Check database connection and migrations.");
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
