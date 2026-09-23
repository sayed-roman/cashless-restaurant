CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');

CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "notes" TEXT,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "totalMinor" INTEGER NOT NULL,
  "currency" VARCHAR(3) NOT NULL DEFAULT 'bdt',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "foodId" TEXT NOT NULL,
  "nameSnapshot" TEXT NOT NULL,
  "priceMinor" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_foodId_idx" ON "OrderItem"("foodId");
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
