import "server-only";
import { PrismaClient } from "@prisma/client";

const globalForDatabase = globalThis as unknown as {
  restaurantDatabase?: PrismaClient;
};

export const db = globalForDatabase.restaurantDatabase ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.restaurantDatabase = db;
}
