-- CreateEnum
CREATE TYPE "FoodCategory" AS ENUM ('STARTERS', 'MAIN_COURSE', 'DESSERTS', 'DRINKS');

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,
    "priceMinor" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'bdt',
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT[],
    "portion" TEXT NOT NULL,
    "allergens" TEXT[],
    "available" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Food_slug_key" ON "Food"("slug");

-- CreateIndex
CREATE INDEX "Food_available_category_sortOrder_idx" ON "Food"("available", "category", "sortOrder");


ALTER TABLE "Food" ADD CONSTRAINT "Food_priceMinor_nonnegative" CHECK ("priceMinor" >= 0);
